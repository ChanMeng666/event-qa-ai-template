'use client';

import { useState, useEffect, useCallback } from 'react';
import { FAQVote, FAQStats, EnhancedPresetQuestion, PresetQuestion } from '@/components/chatbot/types';
import { presetQuestions as fallbackQuestions } from '@/components/chatbot/preset-questions';
import {
  fetchFAQQuestions,
  fetchFAQStats,
  submitVote,
  recordView,
} from '@/lib/notion-faq';

const VOTES_STORAGE_KEY = 'hackathon-faq-votes';

// Initialize default stats for questions
const initializeDefaultStats = (questions: PresetQuestion[]): FAQStats[] => {
  return questions.map(q => ({
    questionId: q.id,
    upVotes: 0,
    downVotes: 0,
    totalViews: 0,
    score: 0,
  }));
};

export function useFAQVoting() {
  const [votes, setVotes] = useState<FAQVote[]>([]);
  const [stats, setStats] = useState<FAQStats[]>([]);
  const [questions, setQuestions] = useState<PresetQuestion[]>(fallbackQuestions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API and localStorage
  useEffect(() => {
    async function loadData() {
      try {
        // Load user votes from localStorage (privacy: keep local)
        const savedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
        if (savedVotes) {
          setVotes(JSON.parse(savedVotes));
        }

        // Fetch questions and stats from API
        const [questionsData, statsData] = await Promise.all([
          fetchFAQQuestions().catch(() => null),
          fetchFAQStats().catch(() => null),
        ]);

        if (questionsData) {
          setQuestions(questionsData);
        }

        if (statsData) {
          setStats(statsData);
        } else {
          // Initialize with default stats if API fails
          setStats(initializeDefaultStats(questionsData || fallbackQuestions));
        }

        setError(null);
      } catch (err) {
        console.error('Error loading FAQ data:', err);
        setError('Failed to load FAQ data');
        // Use fallback data
        setQuestions(fallbackQuestions);
        setStats(initializeDefaultStats(fallbackQuestions));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Save votes to localStorage
  const saveVotes = useCallback((newVotes: FAQVote[]) => {
    try {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(newVotes));
    } catch (error) {
      console.error('Error saving votes:', error);
    }
  }, []);

  // Vote on a question
  const voteOnQuestion = useCallback(async (questionId: string, voteType: 'up' | 'down') => {
    const existingVoteIndex = votes.findIndex(v => v.questionId === questionId);
    const existingVote = existingVoteIndex >= 0 ? votes[existingVoteIndex] : null;
    const previousVoteType = existingVote?.vote || null;

    // Calculate new votes state
    let newVotes = [...votes];
    if (existingVote) {
      if (existingVote.vote === voteType) {
        // Remove vote if clicking the same vote type
        newVotes.splice(existingVoteIndex, 1);
      } else {
        // Change vote
        newVotes[existingVoteIndex] = {
          questionId,
          vote: voteType,
          timestamp: Date.now(),
        };
      }
    } else {
      // Add new vote
      newVotes.push({
        questionId,
        vote: voteType,
        timestamp: Date.now(),
      });
    }

    // Optimistic update for stats
    const newStats = stats.map(stat => {
      if (stat.questionId !== questionId) return stat;

      let upVotes = stat.upVotes;
      let downVotes = stat.downVotes;

      // Remove previous vote
      if (previousVoteType === 'up') upVotes--;
      if (previousVoteType === 'down') downVotes--;

      // Add new vote if different from previous
      if (previousVoteType !== voteType) {
        if (voteType === 'up') upVotes++;
        if (voteType === 'down') downVotes++;
      }

      return {
        ...stat,
        upVotes: Math.max(0, upVotes),
        downVotes: Math.max(0, downVotes),
        score: upVotes - downVotes,
      };
    });

    // Update UI immediately (optimistic update)
    setVotes(newVotes);
    setStats(newStats);
    saveVotes(newVotes);

    // Submit to API in background
    try {
      await submitVote(questionId, voteType, previousVoteType);
    } catch (err) {
      console.error('Failed to submit vote to API:', err);
      // Vote is already saved locally, so we don't need to rollback
    }
  }, [votes, stats, saveVotes]);

  // Increment view count
  const incrementViews = useCallback(async (questionId: string) => {
    // Optimistic update
    setStats(prevStats =>
      prevStats.map(stat =>
        stat.questionId === questionId
          ? { ...stat, totalViews: stat.totalViews + 1 }
          : stat
      )
    );

    // Submit to API in background (silent failure)
    try {
      await recordView(questionId);
    } catch (err) {
      console.error('Failed to record view:', err);
    }
  }, []);

  // Get enhanced questions with voting data
  const getEnhancedQuestions = useCallback((): EnhancedPresetQuestion[] => {
    return questions.map(question => {
      const questionStats = stats.find(s => s.questionId === question.id) || {
        questionId: question.id,
        upVotes: 0,
        downVotes: 0,
        totalViews: 0,
        score: 0,
      };

      const userVote = votes.find(v => v.questionId === question.id)?.vote || null;

      return {
        ...question,
        stats: questionStats,
        userVote,
      };
    }).sort((a, b) => b.stats.score - a.stats.score); // Sort by score (highest first)
  }, [questions, stats, votes]);

  // Get user's vote for a specific question
  const getUserVote = useCallback((questionId: string): 'up' | 'down' | null => {
    return votes.find(v => v.questionId === questionId)?.vote || null;
  }, [votes]);

  return {
    isLoading,
    error,
    enhancedQuestions: getEnhancedQuestions(),
    voteOnQuestion,
    incrementViews,
    getUserVote,
    stats,
  };
}

'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Message } from './types';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brandingConfig } from '@/config';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system' || message.role === 'data';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3 p-4", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {!isSystem && (
        <div className={cn(
          "flex-shrink-0 w-9 h-9 flex items-center justify-center border-2",
          isUser
            ? "bg-primary border-primary shadow-[0px_3px_0px_1px_hsl(var(--primary))]"
            : "bg-gradient-to-br from-primary to-blue-700 border-white/30 shadow-[0px_3px_0px_1px_rgba(59,130,246,0.5)]"
        )}>
          {isUser ? (
            <User size={16} className="text-primary-foreground" />
          ) : (
            <img
              src={brandingConfig.logos.main}
              alt="AI Assistant"
              className="w-6 h-6 object-contain"
            />
          )}
        </div>
      )}

      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "px-4 py-2",
          isUser
            ? "bg-background text-foreground border-2 border-primary shadow-stagger-sm-primary"
            : isSystem
            ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
            : "bg-muted text-foreground border-2 border-border shadow-stagger"
        )}>
          <div className="text-sm prose prose-sm max-w-none">
            {!isUser ? (
              <div className={cn(
                isUser && "text-primary-foreground",
                isSystem && "text-yellow-800",
                !isUser && !isSystem && "text-foreground"
              )}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    code: ({ children, ...props }) => (
                      'inline' in props && props.inline ? (
                        <code className="bg-muted-foreground/20 text-foreground px-1 py-0.5 rounded text-xs">{children}</code>
                      ) : (
                        <code className="block bg-foreground text-background p-2 rounded text-xs overflow-x-auto">{children}</code>
                      )
                    ),
                    pre: ({ children }) => <pre className="bg-foreground text-background p-2 rounded text-xs overflow-x-auto mb-2">{children}</pre>,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "underline hover:no-underline",
                          isUser && "text-primary-foreground/80",
                          isSystem && "text-yellow-600",
                          !isUser && !isSystem && "text-primary"
                        )}
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-border pl-3 italic mb-2">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
        </div>

        {message.timestamp && (
          <div className="text-xs text-muted-foreground mt-1 px-2">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

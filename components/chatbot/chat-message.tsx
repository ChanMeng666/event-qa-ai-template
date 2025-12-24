'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Message } from './types';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          "flex-shrink-0 w-8 h-8 flex items-center justify-center",
          isUser
            ? "bg-primary clip-corner-sm"
            : "bg-gradient-to-r from-primary to-purple-600 rounded-full"
        )}>
          {isUser ? (
            <User size={16} className="text-primary-foreground" />
          ) : (
            <img
              src="/images/AI-Hackathon-Master-Branding-06-2048x1003.svg"
              alt="AI Assistant"
              className="w-5 h-5 object-contain filter brightness-0 invert"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement!;
                parent.innerHTML = '';
                const botIcon = document.createElement('div');
                botIcon.innerHTML = '<svg width="16" height="16" fill="currentColor" class="text-primary-foreground"><path d="M12 2h-2a2 2 0 0 0-2 2v2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2z"></path></svg>';
                parent.appendChild(botIcon);
              }}
            />
          )}
        </div>
      )}

      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground clip-corner-sm"
            : isSystem
            ? "bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg"
            : "bg-muted text-foreground border-2 border-border clip-corner-sm shadow-stagger"
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

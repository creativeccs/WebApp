import { cn } from '@/lib/utils';

interface HTMLContentProps {
  content: string;
  className?: string;
}

/**
 * Component to safely render HTML content from rich text editor
 * Supports both HTML and Markdown rendering
 */
export function HTMLContent({ content, className }: HTMLContentProps) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        'prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl',
        'prose-p:my-2 prose-ul:my-2 prose-ol:my-2',
        'prose-li:my-1',
        'prose-blockquote:border-s-4 prose-blockquote:border-border prose-blockquote:ps-4 prose-blockquote:text-muted-foreground',
        'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
        'prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg',
        '[&_ul]:list-disc [&_ul]:ps-6',
        '[&_ol]:list-decimal [&_ol]:ps-6',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

import React from 'react';

/**
 * Renders text containing markdown bold (**text**) as true HTML bold elements,
 * completely preventing raw ** asterisks from appearing in the user interface.
 */
export const renderFormattedMessage = (rawText: string, isUser = false): React.ReactNode => {
  if (!rawText) return null;

  const paragraphs = rawText.split(/\n\s*\n/);

  return paragraphs.map((paragraph, pIdx) => {
    const lines = paragraph.split('\n');

    return (
      <div key={pIdx} style={{ margin: pIdx === 0 ? 0 : '0.65rem 0 0 0', lineHeight: 1.6 }}>
        {lines.map((line, lIdx) => {
          const parts = line.split(/(\*{1,2}[^*]+?\*{1,2})/g);

          return (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {parts.map((part, partIdx) => {
                if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                  const boldText = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                  return (
                    <strong 
                      key={partIdx} 
                      style={{ 
                        fontWeight: 800, 
                        color: isUser ? '#FFFFFF' : 'var(--text-primary)' 
                      }}
                    >
                      {boldText}
                    </strong>
                  );
                }
                // Strip any stray, unclosed asterisks so literal ** or * never appear on screen
                const cleanedPart = part.replace(/\*{1,2}/g, '');
                return cleanedPart;
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  });
};

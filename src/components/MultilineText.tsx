/**
 * Renders CMS body copy that uses "\n\n" to separate paragraph groups and "\n"
 * for tight line breaks within a group. Single-line groups render as one <p>;
 * multi-line groups render as a tight stack (groupClassName).
 */
export default function MultilineText({
  value,
  className,
  groupClassName,
}: {
  value: string;
  className?: string;
  groupClassName?: string;
}) {
  const groups = value.split("\n\n").filter((g) => g.trim().length > 0);

  return (
    <div className={className}>
      {groups.map((group, i) => {
        const lines = group.split("\n");
        if (lines.length === 1) {
          return <p key={i}>{lines[0]}</p>;
        }
        return (
          <div key={i} className={groupClassName}>
            {lines.map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

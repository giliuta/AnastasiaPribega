export default function Marquee({ items, speed = 40, className = '' }) {
  const content = items.join(' \u00A0\u00A0\u2014\u00A0\u00A0 ');

  return (
    <div className={`overflow-hidden py-6 md:py-8 ${className}`} data-testid="marquee">
      <div className="marquee-wrapper">
        <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-border whitespace-nowrap mx-8"
              style={{ WebkitTextStroke: '1px #D8D4CC', color: 'transparent' }}
            >
              {content} &nbsp;&mdash;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

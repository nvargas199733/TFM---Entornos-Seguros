/*
  HeroBanner:
  Banner reutilizable institucional.

  Props:
  - title
  - description
  - backgroundImage
*/

const HeroBanner = ({
  title,
  description,
  backgroundImage,
}) => {
  return (
    <section
      className="hero-banner"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(13, 72, 118, 0.82),
            rgba(64, 141, 156, 0.72)
          ),
          url(${backgroundImage})
        `,
      }}
    >

      <div className="hero-banner__content">

        <h2 className="hero-banner__title">
          {title}
        </h2>

        <p className="hero-banner__description">
          {description}
        </p>

      </div>

    </section>
  );
};

export default HeroBanner;
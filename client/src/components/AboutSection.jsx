import React from 'react';
import { Zap, Users, Heart, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Discover Real Projects',
    desc: 'Browse authentic apps, tools, and platforms built by NilePixel bootcamp students solving real Ethiopian challenges.',
  },
  {
    icon: Users,
    title: 'Meet the Builders',
    desc: 'Each project card highlights the developer behind it — their name, cohort, and the technologies they chose.',
  },
  {
    icon: Heart,
    title: 'Show Your Support',
    desc: 'Like the projects that inspire you. Every heart motivates a builder to keep shipping and improving their work.',
  },
  {
    icon: Globe,
    title: 'Submit Your Own',
    desc: 'Are you a NilePixel student? Click "Submit project" to add your creation to the public showcase board.',
  },
];

export default function AboutSection() {
  return (
    <section className="about-section" aria-labelledby="about-heading">
      <div className="content-wrap">
        <div className="about-header">
          <div className="about-eyebrow">What is LaunchBoard?</div>
          <h2 id="about-heading" className="about-title">
            A public stage for every project built at NilePixel
          </h2>
          <p className="about-subtitle">
            LaunchBoard is the official student project showcase for{' '}
            <strong>NilePixel Bootcamp</strong>. Whether you're a recruiter,
            mentor, fellow student, or just curious — this is where Ethiopian
            tech talent goes live.
          </p>
        </div>

        <div className="about-features-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="about-feature-card">
              <div className="about-feature-icon" aria-hidden="true">
                <Icon size={22} />
              </div>
              <div className="about-feature-text">
                <h3 className="about-feature-title">{title}</h3>
                <p className="about-feature-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

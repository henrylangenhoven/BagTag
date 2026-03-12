import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-tag-page',
  template: `
    <section class="public-layout">
      <article class="tag-card">
        <p class="eyebrow">Public tag flow</p>
        <h1>Tag {{ publicId }}</h1>
        <p>
          This page is the public reporting entry point. It should stay privacy-preserving and never
          expose the owner's identity.
        </p>

        <div class="status">
          <span class="dot"></span>
          <span>Next: look up tag metadata and log a scan event on page load.</span>
        </div>
      </article>

      <article class="report-card">
        <h2>Finder journey</h2>
        <ol>
          <li>Open the QR code URL.</li>
          <li>See a calm public page with clear bag reporting copy.</li>
          <li>Optionally share a message about where the bag was found.</li>
          <li>Optionally share location only with explicit consent.</li>
        </ol>
      </article>
    </section>
  `,
  styles: `
    .public-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
      gap: 1rem;
    }

    .tag-card,
    .report-card {
      padding: 1.6rem;
      border-radius: var(--radius-xl);
      border: 1px solid var(--line);
      background: var(--surface);
      box-shadow: var(--shadow-soft);
    }

    .eyebrow {
      color: var(--success);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0.85rem 0;
      font-size: clamp(2.4rem, 6vw, 4.6rem);
      line-height: 0.96;
    }

    p,
    li {
      color: var(--muted);
      line-height: 1.7;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      margin-top: 1.2rem;
      padding: 0.8rem 1rem;
      border-radius: 999px;
      background: rgba(46, 106, 79, 0.1);
      color: #244f3b;
    }

    .dot {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 999px;
      background: var(--success);
    }

    ol {
      margin: 0;
      padding-left: 1.2rem;
    }

    @media (max-width: 900px) {
      .public-layout {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class PublicTagPageComponent {
  protected readonly publicId =
    inject(ActivatedRoute).snapshot.paramMap.get('publicId') ?? 'unknown';
}

import { APP_ROUTES } from '../../../shared/constants/routes'
import type { HomePageContent } from '../../../shared/types/content'

export const homePageContent = {
  hero: {
    eyebrow: 'The Future of Auto Care',
    segments: [
      { text: 'Smart Auto Repair.', breakAfter: true },
      { text: 'Transparent.', highlight: true },
      { text: ' Fast.', breakAfter: true },
      { text: 'Digital.' },
    ],
    description:
      "Track your car service, get real-time diagnostics, and manage everything online through AUTOFIX's precision atelier platform.",
    actions: [
      { label: 'Book Service', to: APP_ROUTES.bookingEntry, tone: 'primary' },
      { label: 'Track Repair', to: '/#workflow', tone: 'secondary' },
    ],
    backgroundImage: {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBefyme3u_Nd1X7SA0vLiH_8E5QGHO5ShDmWS5Yjk_bsuw-pjdU9SCcOGtGqgGnEnaBVYy10JttMAHCt1l96T1qrRUMesQqXzAhuehaHmfIs6gIXzdTqsZcfFfYv14bPkePlUMzFHsK-fWyGWkJKI083N9FeQVFoAryyupO6XsnOKVsHT3Nzw0m-cdUm9f7AZLRCOILNOBOy3PplxMa-e2osHSMuUGLLIlBtpf7yGkcPACmWnjuH3EsHrtHJjFPUQfPuYaiMYzkIgMf',
      alt: 'Ultra-modern clean car repair studio with bright laboratory lighting and high-tech diagnostic equipment.',
    },
  },
  trustBar: {
    metrics: [
      { label: 'Direct Line', value: '+1 (800) AUTOFIX', icon: 'phone' },
      { label: 'Location', value: '782 Precision Ave, SF', icon: 'location' },
      { label: 'Availability', value: 'Mon - Sat: 8am - 7pm', icon: 'clock' },
    ],
    rating: {
      value: '4.9/5',
      label: 'TrustScore',
      avatars: [
        {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjBGXXaEU5J2E20ohDS8yS5RELqaueBsfqMLXTi0S3FCQAVSZnagcjo2XLOtJY_65l7_hAUY-CTmdYxSdnX_FaCUJuwtk8x50NrtAyjumKPQ0GtygtcAHXlDlsGx9n4n8uixOGoW1fWHE6XETQzOBcWY80nruNN4DYfAiBlBw68QlEMTEdUrTo84G0ZYqBMaHQkowCXvZkj0jTK550_DoXxUXFKkmNUAB_zS-Nay1QYUZJtkC7nEtCgwXrI6EF2Vmn2XSAxMNXV0WV',
          alt: 'Smiling customer portrait.',
        },
        {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy2DAli68leB4LGCFvlZWKTFVbd2DP4SoxHdMBQ1IFlEQKZAdhZQaKfXR6UuCw8C3DlBZEtqJbE-7Sn6qbW0PMhfzn5us_oxbH-WzscYPXOK3tNa_fg303lNOxh8q_Lzn9QQIRrfKwI3lEmy2JYurYU9VR0Ot6VnoAYoZXXFXpPxSqQ45l60JglSHGnkChIjBrwOy_r3cZZG1Fa2ZUI0Lf2C_mz2f0jJsDLDRS1K3ocD9k3xMviyY-JjTOGw6lLEDY_ojwLLJWNY48',
          alt: 'Customer portrait with wavy hair.',
        },
      ],
    },
  },
  features: {
    title: 'Precision-First Features',
    description:
      "Digital management that puts you in the driver's seat of your vehicle's health.",
    items: [
      {
        title: 'Online Booking',
        description:
          'Choose service, select time, and register your vehicle with an intuitive calendar flow.',
        icon: 'calendar',
      },
      {
        title: 'Diagnostics & Estimation',
        description:
          'See detected issues through photo-backed reports and approve repair costs instantly.',
        icon: 'diagnostics',
      },
      {
        title: 'Parts Availability',
        description:
          'Real-time inventory visibility keeps vehicles moving without waiting on components.',
        icon: 'inventory',
      },
      {
        title: 'Payment & Invoice',
        description:
          'Secure digital payments and stored invoices for tax records, audits, and resale history.',
        icon: 'payments',
      },
      {
        title: 'Service Tracking',
        description:
          'Live updates from the shop floor show which stage your repair is in and who owns it.',
        icon: 'tracking',
      },
      {
        title: 'Digital Service History',
        description:
          'A structured maintenance timeline that can later be replaced by a connected backend feed.',
        icon: 'history',
      },
    ],
  },
  workflow: {
    eyebrow: 'The Workflow',
    title: 'Five Steps to Total Care',
    steps: [
      {
        number: '1',
        title: 'Book Service',
        description: 'Instant appointment with real-time slot selection.',
        emphasized: true,
      },
      {
        number: '2',
        title: 'Diagnostics',
        description: 'AI-assisted scan and visual inspection reports.',
      },
      {
        number: '3',
        title: 'Approve Estimate',
        description: 'Digital sign-off on transparent pricing.',
      },
      {
        number: '4',
        title: 'Repair Mode',
        description: 'Certified technicians execute with precision.',
      },
      {
        number: '5',
        title: 'Pay & Collect',
        description: 'Keyless pickup or white-glove delivery.',
      },
    ],
  },
  services: {
    title: 'Comprehensive Care Suite',
    description:
      'From routine maintenance to complex mechanical overhauls, we treat every vehicle like a masterpiece.',
    action: {
      label: 'Explore All Services',
      to: '/#services',
      tone: 'primary',
    },
    items: [
      {
        title: 'Fluid Maintenance',
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATtH7R8MTGebymr6cxL7caL9sFwemRJ1ByvDRyu2-IhK3lOZLzI07g8csneS9Rf8gKRZGtIqccQX7ptKhXxXrV_veyBqBzA8uVgFRfHYyQdDy_lrnxC_zJs-Dgw_NRbHehn-DNN0ucLG3dr1Mi7SXcEJZzIV9MUQ-wtvVfgEWMdmNmb2M4HpOh0mGTOXwInVxo3YfrIxqvdj2gkWQn0Uf0zWQFHx56Gw5tZtlT3ajmkTKm80dwTLpPlH_8-yCAWdg07BmUD97UK5Ui',
          alt: 'Engine oil being poured into a clean high-performance engine.',
        },
      },
      {
        title: 'Braking Systems',
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_w6_Ps1363OI-x8vLxB1PWfCRpAhrgf_KDgWq6X_HkrI9T_xpvU6UW8SMyHb4QZ5l2TQFcLGGvvhSiWdPqSni8TW2bhikdYK1jbYmTerPoUJ1w5IahXAOiJqX4d_7Qjh9cNeyilifNaJYH0cHz7igl_qQiNQOXGw3zzs1UxoVrbLdAlwN-Q1eGSi-qvYg4R4CZqrRHYD_lGDyhct-OxCqs_HW09CqciDspa1OftZFN0R7hQMbST2dZEwIjglJcgTwFb2HG7ArxAZZ',
          alt: 'Close-up of a modern brake system.',
        },
      },
      {
        title: 'Advanced Diagnostics',
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP-eyZv1fnPH55vjw1AkVzqzADvYMHkwbx_n5-cgYJIp0qTSqfeTSURQ2BUI6DRBV6GPiS7zTY6x3LonL3R695SS5wPbL0WPz_k0Xy37v7ycmLqMwiocK5WNRQCESWwBehThGK5pW29C7GE7nlQ6S9I3CPYl5GjENacXf2qS99iGxvQoYAOi8TDcyEIBY22WtqGrE3fyw1CVyF6XO1mNT_ixNOg0-glE5Jkxt5Z-H2C6aj0suT_h8RU1nU5xHmtciMkU2leba__QN7',
          alt: 'Modern dashboard with engine diagnostic data and telemetry.',
        },
      },
      {
        title: 'Engine Performance & Overhaul',
        wide: true,
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApbwdZnBTGXvMrIcinxLJcmIvQbKuJU2KtD5qZXMr6HpPBwU7BFvFxK2jA8hiA1_x2030WQKWnxgbmksr5OtAVWJoTAS2DoNQoKGhU_Xfki1eg8A-HVvt6p5ai4nEKNEmmvMWhGBENC6oCjCMPwvrmaA3n5YwNTesnFwF20uGBWySgKO85yXBatf2rycnvY--iQjbwG3v9-0GnXt7Zmdyhwhr9svhSV3nCk6xeIiJeb7TKPQqx4ZeZ-rEvbxMQPMZaamLwjuJzFges',
          alt: 'Pristine disassembled luxury engine in a workshop.',
        },
      },
      {
        title: 'Tire Engineering',
        image: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9dQsQgzl93dWzjMCp75dhaL4TwdpCYv9hoy5LFXeQkkG_jsk1BDWDXgYntYi34N7cXmgGypLbZH2jX0DVLG2DyZ27jTEYC4ZH2uhsMFwXKBhtaskubyBXKmCbQGuygRhIzTc9wG6VXWKw2JM3GZCoYlKTX8kTv-QmUL6GAEcG-UY3FUVpAbxlWCeecCdMN8iopYaMlCLhaGUZE7aeXoMnn7HMVeeDafImMwLMVrmqSV0oRXWqHpkxwHFTnQMOhcNmBXWURr_bFhV0',
          alt: 'Modern tire on a digital balancing machine.',
        },
      },
    ],
  },
  testimonials: {
    title: 'Driving Satisfaction',
    description:
      'Read why over 1,200 clients trust their precision machinery to our digital atelier.',
    items: [
      {
        quote:
          'The level of transparency is unparalleled. Seeing the diagnostic photos before approving the repair changed my whole perspective on mechanics.',
        author: 'James Richardson',
        role: 'Tesla Model S Owner',
        rating: 5,
        avatar: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-vbbH3hnI1o2JuopPgkdqlS3OIMa7pAiAe9ujs5s1Kmb3mus79AxQYSrqyDUP1C3BjgAgyOc2Ibo_G9JEmLoUz-fYApmJqoEr4LVEKZ-RWuAdC5--chKuE9ecG2q0JcoUWNKfnsJXntrG1XP9BH7kACkJNG-04lUCKKzFEU97rlihGK_asBSV5HxsPAKz_uQiqf-6vtEf70kTsnadv0rPruELZfVRRn9p5Wt1wz9znlJhPdETTKT4i1ajUpsbsCiZrYZtqteE0jDm',
          alt: 'Portrait of James Richardson.',
        },
      },
      {
        quote:
          'Booking took exactly 45 seconds. The real-time tracking while I was at work gave me total peace of mind.',
        author: 'Sarah Jenkins',
        role: 'Audi RS7 Owner',
        rating: 5,
        avatar: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD18AXIE7E6ijzKuvVQbOegKhLRXUx2jf8LyfQF4O0vwJFfMSiQZgPEVya2B4COYPdVFOIJb6FyUikf14pbWNG5X_U02zHnXiqK8a6ewgtmVMQ9sc5xZ192jo9RZFRwh0kNbYWRAgaRkf-YQv8aHHZTbTSh8fAErvI5v7c8OLnywosfqXR3uPI-U0legFEmMR3clzzCM0ptzJQyY6orOIyskf2awcHxPzGOl5Pt2ofbFHz_Ow-dfAg2R1VzdKy7UOu-_OAH0L9tObWs',
          alt: 'Portrait of Sarah Jenkins.',
        },
      },
      {
        quote:
          'Finally, a service center that understands tech. The digital invoices and full history log are a lifesaver for my fleet management.',
        author: 'Michael Chen',
        role: 'Fleet Manager',
        rating: 5,
        featured: true,
        avatar: {
          src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX2R8lrZkideu3bemR1i_LUvIyAlebsr1uh9fzq5nlxhkGn02gilWeV9tlJ1MnhNR4x0ni4hhhIQ_lxEzV6MseXf5e-CEEO26agPi7cUioT3Ujzjp6NYGFluqKxuXFXXE_dAXuGP5zC5Ie4JCwNUFCJLVWzgTs09y6munZsdnQJGeTkoEjUqUpXuOyd09Tot0b0huBqu3-S9FF2sLZWJ6EGKaUvPTvAWs34AymQnd4t3QC6w2Kld_LRQ1PAieeoRLm6vq8UgieCaI2',
          alt: 'Portrait of Michael Chen.',
        },
      },
    ],
  },
  cta: {
    title: 'Ready for a Better Repair Experience?',
    description:
      'Join thousands of smart car owners who have upgraded their vehicle maintenance to the digital age.',
    action: {
      label: 'Book your service today',
      to: APP_ROUTES.bookingEntry,
      tone: 'inverse',
    },
    highlights: ['No Hidden Fees', 'Expert Technicians', 'Full Warranty'],
    backgroundImage: {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASJr28U9Pc33CjFSzqtA-XYgElyZLyAewLNxb-7ondqf5UETUEhjEBb2PHWCGpV0JRPuJyoC1WiwnBFDRK2R9D5BYDIrWN9tuKyXoRYTBDS_Yevv5nXJNeBUNN99ETi7k_Bafcb1g-FrZF1h98FtKYtI6fCvSzUXU8ykciOzb1GAQF2NTZlZxhY0J5EbQigTK_h4P0FJKw48kT_14zjAd2vLWDtsDi-BYXP4bUgbY9w-Mv5BpaEM2mLwaLZCb-FcoyYSHe0VTga4St',
      alt: 'Blurred workshop textures with a teal-tinted lens flare.',
    },
  },
} satisfies HomePageContent

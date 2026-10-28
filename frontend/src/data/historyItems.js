<<<<<<< HEAD
/** Number of history cards shown per page */
export const HISTORY_ITEMS_PER_PAGE = 9;
=======
/** Mock analysis history — replace with API data later */
export const HISTORY_ITEMS = [
  {
    id: "1",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKodtOFVHbaGjGGdS_5EoStDtq07fOnSaPH8bPw6TRWHg7W3bHzRDqkIeWJ0AxYMew7LgspA0QZKWMLeF-RTD1Reazzf0Li4pZO--PcaiFnlUM-DAT3WpF9c2vt7fAxOfBO-HduKrshBx9iB9vD8ZHeFWLH9ge82XUBZOPr7o2t0HwsquiaLAnXyOdvfbsUtxw_1iKj1KHG3IgvVXIXbaEOMMO38q6y34Kz8of-IP4cfm37qk3oaaWa3rit0GZ2Q3FuYShxR1KzHQ",
    imageAlt: "Gourmet artisanal pizza on a rustic wooden table",
    filename: "pizza-analysis.jpg",
    confidence: 98,
    tags: ["Pizza", "Gourmet", "Italian"],
    date: "Oct 24, 2024",
    time: "14:20 PM",
    resolution: "4032 × 3024",
    fileSize: "4.2 MB",
    caption:
      "A gourmet artisanal pizza on a rustic wooden table with bright seasonal toppings and fresh basil.",
    insights: [
      { label: "Pizza", score: 98.4 },
      { label: "Gourmet", score: 94.2 },
      { label: "Italian", score: 72.1 },
      { label: "Wooden Table", score: 58.5 },
      { label: "Fresh Ingredients", score: 12.8 },
    ],
  },
  {
    id: "2",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUPeHzdbQg4lvz6ilez2JspuoPRZi58-6moSqg9SvHsJbULPRUDxjFLEB3wyF7qf0FvC4ckkj9XB2HsmZ-WXFyLpYfeyGynXMEuRB-ZbRgv5Mj_VIf5L1jobi1nKXFD8yGVgTAPdZvJsCi6pqtBRGu9gQ0USVk07XR0_F50yid2JAfy2hkBh824mTU79F-8t-42uRe3omB0ImWnqHU-vUVwLcbqJGyUFJODu-y9Go8K8b7K_K--0BU3z8UQPxhUMHrAnk3SJdKcl8",
    imageAlt: "Golden retriever puppy in a green meadow",
    filename: "golden-retriever.jpg",
    confidence: 94,
    tags: ["Dog", "Puppy", "Golden Retriever"],
    date: "Oct 23, 2024",
    time: "09:15 AM",
    resolution: "3840 × 2160",
    fileSize: "2.8 MB",
    caption:
      "A happy golden retriever puppy sitting in a sunny meadow, captured with warm natural lighting.",
    insights: [
      { label: "Dog", score: 94.0 },
      { label: "Puppy", score: 88.5 },
      { label: "Golden Retriever", score: 82.3 },
      { label: "Meadow", score: 69.1 },
      { label: "Outdoor", score: 45.7 },
    ],
  },
  {
    id: "3",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiv8izVjSxwtHySOEBC_bbGqYkVD68s3FUAzR6wlPLuH2VKQINtvu1Bqkc2RtcmHNbzaMjkCdpp-G7zCQfyRGwR9L6fYigZFBeqfUdZCvNIh50zayUlCgVofQej9kc5b8c3U_1z31r7ImGhTGXXMUo2eu0l1PWgeRAFEtBvggUBOj3uiQLGdajktGYgKrIJGE4e7BWyvUk6EYKD2nE5WzsiQPK32PD4Ok9iglWtzooHLko2CofKURuScIDef-XXbDNb0Zg3RfbBfM",
    imageAlt: "Foggy forest at sunrise with light rays",
    filename: "forest-sunrise.jpg",
    confidence: 89,
    tags: ["Forest", "Fog", "Sunrise"],
    date: "Oct 22, 2024",
    time: "17:45 PM",
    resolution: "1920 × 1080",
    fileSize: "3.1 MB",
    caption:
      "A misty forest landscape at sunrise, with gentle light filtering through the trees.",
    insights: [
      { label: "Forest", score: 89.2 },
      { label: "Fog", score: 83.4 },
      { label: "Sunrise", score: 78.5 },
      { label: "Trees", score: 61.3 },
      { label: "Nature", score: 36.7 },
    ],
  },
  {
    id: "4",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBM5hpmAe9v1HaX3Zwfz3B6MRaRpeeJ6Bj3A5xojb5HgpX46ex9q-qy79vV5iAw9JP6dLgAVx1iz-9aJ82VMI0OKsKUFPTdNrv36_ewYkIau7KwIg7DP5pWltWQYMCRnKfx_uu_00HzH5mi3RC2TZKPKT3_NJ58RpKTLhWa7hkmI5QPEr7UpY5fRrEhz0lzDIZXPibyvTj1RkHUxUiSRLicAOF4xICPCpA7T9PYzmm6u9xzVrASAxhJdTL9-X3mdmN8APMmv_tSFq4",
    imageAlt: "Modern glass skyscraper reflecting blue sky",
    filename: "skyscraper-office.jpg",
    confidence: 91,
    tags: ["Skyscraper", "Modern", "Office"],
    date: "Oct 21, 2024",
    time: "11:05 AM",
    resolution: "3500 × 2333",
    fileSize: "3.7 MB",
    caption:
      "A modern glass skyscraper reflecting the sky, captured in sharp architectural detail.",
    insights: [
      { label: "Skyscraper", score: 91.1 },
      { label: "Architecture", score: 86.7 },
      { label: "Glass", score: 74.3 },
      { label: "City", score: 58.2 },
      { label: "Reflection", score: 31.9 },
    ],
  },
  {
    id: "5",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5IDc8F8xsQGSOKs9n4s3enOgsNAiWZkHBcM96Zz7HAfCSm4vncx-I01Hht5SBjCt14tRkTC3TwDDnaP5xGwpZgPguctAZ5I7xWhsRrXzKpTlnvqGCEoX00ojV1-stlrXmn5ejMfRiSoRFhRK1Wa0DbJ5PNmpXamVuOL2uxloPnAylUoudHgzOBX1lnlVHVAkkevbIK-M9tA59Kg7DF2I1d5N4OyHC32tox1qTqveD4sBF_yjpCPollNbZR8Bh9FcJRAsrmiudwgU",
    imageAlt: "Macro photograph of a circuit board with blue accents",
    filename: "circuit-board.jpg",
    confidence: 82,
    tags: ["Circuit", "Hardware", "CPU"],
    date: "Oct 20, 2024",
    time: "08:30 AM",
    resolution: "2560 × 1600",
    fileSize: "2.2 MB",
    caption:
      "A close-up macro shot of a circuit board with sharp blue accents and electronic pathways.",
    insights: [
      { label: "Circuit", score: 82.6 },
      { label: "Hardware", score: 77.4 },
      { label: "CPU", score: 70.9 },
      { label: "Electronics", score: 55.8 },
      { label: "Macro", score: 29.4 },
    ],
  },
  {
    id: "6",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAq67q3gPib7wiVGrwNlT0Nf5RffvO0p1-8s5t4ZbZnHCFNnB8rAbizLrgWhUb7ZPQ5eXzAdtTP20BPJ3Y0horXWdiRXd4tgXLLMHRVcDE9A6VDIw0uw557UMsSU4pT8I7rIkkxdAuLbBnrtwoKd5yJ0DL5E-0vOE6UvGTDGkfEEwdOceBJxYHV-gRh7BJschIpgujygm6qoAlfCoi8WAVbQ5lCuNaD1Dz88UP1wsiuS2yBYy_b2EcvSmKgsafIMq_aVZ7qmRousGM",
    imageAlt: "Rolling sand dunes in a desert at golden hour",
    filename: "desert-dunes.jpg",
    confidence: 97,
    tags: ["Desert", "Sand", "Nature"],
    date: "Oct 19, 2024",
    time: "13:10 PM",
    resolution: "4096 × 2734",
    fileSize: "5.1 MB",
    caption:
      "Golden hour light across rolling desert dunes, captured with warm natural tones.",
    insights: [
      { label: "Desert", score: 97.0 },
      { label: "Sand", score: 92.3 },
      { label: "Nature", score: 83.8 },
      { label: "Dunes", score: 65.4 },
      { label: "Landscape", score: 42.1 },
    ],
  },
];

export const HISTORY_ITEMS_PER_PAGE = 3;
>>>>>>> 3b3f2cce2d6eff1255faa56c425fe24c156a5633

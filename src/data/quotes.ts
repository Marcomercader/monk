export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  {
    text: "Be — don't try to become.",
    author: "Osho",
  },
  {
    text: "The real question is not whether life exists after death. The real question is whether you are alive before death.",
    author: "Osho",
  },
  {
    text: "If you love a flower, don't pick it up. Because if you pick it up it dies and it ceases to be what you love. So if you love a flower, let it be. Love is not about possession. Love is about appreciation.",
    author: "Osho",
  },
  {
    text: "Drop the idea of becoming someone, because you are already a masterpiece. You cannot be improved. You have only to come to it, to know it, to realize it.",
    author: "Osho",
  },
  {
    text: "Experience life in all possible ways — good-bad, bitter-sweet, dark-light, summer-winter. Experience all the dualities. Don't be afraid of experience, because the more experience you have, the more mature you become.",
    author: "Osho",
  },
  {
    text: "Courage is a love affair with the unknown.",
    author: "Osho",
  },
  {
    text: "The moment you accept yourself, you become beautiful.",
    author: "Osho",
  },
  {
    text: "One thing: you have to walk, and create the way by your walking; you will not find a ready-made path.",
    author: "Osho",
  },
  {
    text: "Nobody has the power to take two steps together; you can take only one step at a time.",
    author: "Osho",
  },
  {
    text: "To be creative means to be in love with life. You can be creative only if you love life enough that you want to enhance its beauty, you want to bring a little more music to it, a little more poetry to it, a little more dance to it.",
    author: "Osho",
  },
  {
    text: "Wherever you are is called Here, and you must treat it as a powerful stranger.",
    author: "Osho",
  },
  {
    text: "The truth is not something outside to be discovered, it is something inside to be realized.",
    author: "Osho",
  },
  {
    text: "Don't move the way fear makes you move. Move the way love makes you move. Move the way joy makes you move.",
    author: "Osho",
  },
  {
    text: "The mind: a beautiful servant, a dangerous master.",
    author: "Osho",
  },
  {
    text: "Wisdom is knowing I am nothing, love is knowing I am everything, and between the two my life moves.",
    author: "Nisargadatta Maharaj",
  },
  {
    text: "The quieter you become, the more you can hear.",
    author: "Ram Dass",
  },
  {
    text: "In the beginner's mind there are many possibilities, but in the expert's mind there are few.",
    author: "Shunryu Suzuki",
  },
  {
    text: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.",
    author: "Zen proverb",
  },
  {
    text: "The obstacle is the path.",
    author: "Zen proverb",
  },
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha",
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "Three things cannot be long hidden: the sun, the moon, and the truth.",
    author: "Buddha",
  },
  {
    text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
  },
  {
    text: "Knowing others is wisdom. Knowing yourself is enlightenment.",
    author: "Lao Tzu",
  },
  {
    text: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
  },
  {
    text: "When I let go of what I am, I become what I might be.",
    author: "Lao Tzu",
  },
  {
    text: "Silence is the language of God; all else is poor translation.",
    author: "Rumi",
  },
  {
    text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    author: "Rumi",
  },
  {
    text: "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there.",
    author: "Rumi",
  },
  {
    text: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    author: "Rumi",
  },
  {
    text: "Sit quietly, doing nothing, spring comes, and the grass grows by itself.",
    author: "Zen proverb",
  },
  {
    text: "Not thinking about anything is Zen. Once you know this, walking, sitting, or lying down, everything you do is Zen.",
    author: "Bodhidharma",
  },
  {
    text: "Zen is not some kind of excitement, but concentration on our usual everyday routine.",
    author: "Shunryu Suzuki",
  },
  {
    text: "Each morning we are born again. What we do today is what matters most.",
    author: "Buddha",
  },
];

export function getDailyQuote(): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return quotes[dayOfYear % quotes.length];
}

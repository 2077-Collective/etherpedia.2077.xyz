## 2077 Collective Etherpedia
___

---
{authors.map((author, index) => (
  <p class="italic py-4">
    {index < authors.length - 1 ? (
      <>
        <a class="underline underline-offset-3"
          href={`https://twitter.com/${author.twitterHandle}`}
          target="_blank"
        >
          {author.name}
        </a>
        {index < authors.length - 2 ? ', ' : ' and '}
      </>
    ) : (
      <a class="underline underline-offset-3"
        href={`https://twitter.com/${author.twitterHandle}`}
        target="_blank"
      >
        {author.name}
      </a>
    )}
  </p>
))}
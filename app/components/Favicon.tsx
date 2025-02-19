import Head from 'next/head'

const Favicon = () => {
  return (
    <Head>
      <link rel="icon" type="image/png" href="/icons/pink-yacht-club.png" />
      <link rel="apple-touch-icon" href="/icons/pink-yacht-club.png" />
      <link rel="shortcut icon" href="/icons/pink-yacht-club.png" />
    </Head>
  )
}

export default Favicon
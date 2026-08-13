import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  // Le typecheck et le lint tournent en CI comme étapes distinctes.
  // On ne les désactive jamais ici : un build vert doit vouloir dire quelque chose.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
}

export default config

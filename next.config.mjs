/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Cambia esto por el nombre de tu repositorio en GitHub
  // Por ejemplo, si tu repo es: github.com/tu-usuario/descomponer-numeros
  basePath: '/descomponer_numeros',
  assetPrefix: '/descomponer_numeros/',
}

export default nextConfig

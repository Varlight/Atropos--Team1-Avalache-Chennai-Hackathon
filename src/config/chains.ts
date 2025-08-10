import { Chain } from 'wagmi/chains'

export const avalancheFuji: Chain = {
  id: 43113,
  name: 'Avalanche Fuji C-Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_FUJI_RPC_HTTP!] },
    default: { http: [process.env.NEXT_PUBLIC_FUJI_RPC_HTTP!] },
  },
  blockExplorers: {
    default: { 
      name: 'SnowTrace', 
      url: 'https://testnet.snowtrace.io',
      apiUrl: 'https://api-testnet.snowtrace.io'
    },
  },
  testnet: true,
}
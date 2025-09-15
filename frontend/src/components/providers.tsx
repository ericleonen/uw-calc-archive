import { Provider } from 'jotai'

type ProvidersProps = {
    children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}
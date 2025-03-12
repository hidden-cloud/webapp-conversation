import { getLocaleOnServer } from '@/i18n/server'
import Image from 'next/image'  // 引入Next.js的Image组件
import Logo from '@/public/logo.svg'  // 替换为你的Logo实际路径


import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <div className="fixed top-2 right-10 z-50">
          <div className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="Logo"
              width={100}  // 根据需要调整尺寸
              height={34}
            />
          </div>
        </div>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="w-screen h-screen min-w-[300px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout

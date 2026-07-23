import { Mail, MapPin, Phone, ShoppingBag } from 'lucide-react'

/**
 * Branded site footer. Grounds the page, provides the expected shop links, and
 * removes the "floating in space" feeling when a short result set doesn't fill
 * the viewport. Links are decorative (demo shop).
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Sollers<span className="text-brand-600"> Shop</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            Современный интернет-магазин с тысячами товаров ведущих брендов и
            быстрой доставкой по всей стране.
          </p>
        </div>

        <FooterColumn
          title="Каталог"
          links={['Новинки', 'Хиты продаж', 'Скидки', 'Бренды']}
        />
        <FooterColumn
          title="Компания"
          links={['О нас', 'Вакансии', 'Партнёрам', 'Блог']}
        />

        {/* Contacts */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">Контакты</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-500" />
              +7 (800) 555-01-02
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-500" />
              hello@sollers.shop
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-500" />
              Москва, ул. Примерная, 1
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Sollers Shop. Демонстрационный проект.</p>
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'MIR', 'ApplePay'].map((p) => (
              <span
                key={p}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-500"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-slate-900">{title}</h3>
      <ul className="space-y-2 text-sm text-slate-500">
        {links.map((link) => (
          <li key={link}>
            <span className="cursor-pointer transition-colors hover:text-brand-600">
              {link}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

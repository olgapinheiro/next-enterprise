import { cva, type VariantProps } from "class-variance-authority"

import { twMerge } from "tailwind-merge"

const list = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "border",
    "border-blue-400",
    "transition-colors",
    "delay-50",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-blue-400", "text-white", "hover:enabled:bg-blue-700"],
        secondary: ["bg-transparent", "text-blue-400", "hover:enabled:bg-blue-400", "hover:enabled:text-white"],
      },
      size: {
        sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "py-1.5", "px-4"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "py-2.5", "px-6"],
      },
      underline: { true: ["underline"], false: [] },
    },
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
)

export type ListHeader = {
  name: string
  key: string
  description?: string
}

export type ListItem = {
  [key: ListHeader['key']]: string
}

export interface ListProps extends VariantProps<typeof list> {
  listName: string
  listHeaders: ListHeader[]
  listItems: ListItem[]
}

interface ListItemProps {
  item: ListItem
  headers: ListHeader[]
}

function ListItem(props: ListItemProps) {
  const { item, headers } = props
  return (
    // Todo: transform this in a link to the Item Page
    <tr key={`item-${item.id}`} className="flex flex-row">
      {headers.map((header) => (
        <td className=" flex flex-col mr-4 mb-2 text-xl font-bold dark:text-white">{item[header.key]}</td>
      ))}
    </tr>
  )
}

export function List({ intent, size, underline, ...props }: ListProps) {
  const { listName, listHeaders, listItems } = props

  if (!listName || !listHeaders || !listItems) {
    return null
  }

  return (
    <>
      <h3 className="mb-2 text-xl font-bold dark:text-white">{listName}</h3>

      <table>
        <thead>
          <tr className="mb-4 flex flex-row">
            {listHeaders.map((header) => (
              <th key={header.key} className="flex flex-col mr-4">
                <span className="mb-2 text-lg font-bold dark:text-white">{header.name}</span>
                {/* <Tooltip>{header.description}</Tooltip> */}
              </th>
            ))}
          </tr>
        </thead>

        {listItems.map((item) => (
          <ListItem item={item} headers={listHeaders} />
        ))}

      </table>
    </>
  )
}
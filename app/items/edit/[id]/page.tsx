import { Metadata } from "next"
import EditItemPage from "./EditItemPage"

export const metadata: Metadata = {
  title: "Edit Item",
  description: "Edit an existing item",
}

export default function Page() {
  return <EditItemPage  />
}

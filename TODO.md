# TODO for Adding Receipt Page

- [x] Create src/pages/Receipt.jsx: Component that uses useParams to get id, finds the item from history data, and displays receipt details.
- [x] Create src/styles/Receipt.css: Styling for the receipt page, similar to UsageHistory modal.
- [x] Edit src/App.jsx: Add import for Receipt component and add route <Route path="/receipt/:id" element={<Receipt />} />
- [x] Edit src/pages/UsageHistory.jsx: Change the "ใบเสร็จ" button to a Link component navigating to `/receipt/${item.id}`
- [x] Remove unused modal code from UsageHistory.jsx

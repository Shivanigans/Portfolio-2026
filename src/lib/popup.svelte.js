// Whether a project popup is open. The Tinkerings page sets it, and the side nav
// reads it, so it can't be clicked or tabbed into while the popup is showing.
export const popup = $state({ open: false });

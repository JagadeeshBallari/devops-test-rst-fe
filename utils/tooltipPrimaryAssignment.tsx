export const getTooltipContentInventoryTypePrimaryAssignment = (): string => `
  <div class='font-bold text-[14px] '>INVENTORY TYPE PRIMARY ASSIGNMENT</div>
  <div class='mt-1 text-[12px] font-light'>
    <ol class=" ml-6 space-y-2 mb-3" style="list-style-type: decimal;">
      <li>For each legacy Room Pool, the Room Set Up Tool has identified the inventory type with the largest number of guestrooms as the primary inventory type. This mapping will be used to assist with the migration of existing reservations from MARSHA to ACRS.</li>
      <li>Review and confirm the mapping to the primary inventory type. If you need to adjust, select the appropriate Inventory Type Code in the corresponding field.​</li>
    </ol>
  </div>
`;
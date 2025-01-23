export const getTooltipContentInventoryTypeList = (): string => `
  <div class='font-bold text-[14px] '>INVENTORY TYPE LIST</div>
  <div class='mt-1 text-[12px] font-light'>
    <ol class=" ml-6 space-y-2 mb-3" style="list-style-type: decimal;">
      <li>Review the list of unique Inventory Types generated based on the Room Configuration + Shoppable Attribute combinations for your property.</li>
      <li>Confirm the pre-populated Currency Code and adjust as needed. Manually enter the minimum rate and maximum rate for each Inventory Type.​</li>
      <li>Change the Displayable value to “No” if the inventory type should not viewable broadly (i.e., Presidential Suite)​</li>
      <li>Manually enter the number of extra person(s) that an inventory type can accommodate, if applicable.</li>
      <li>For any Inventory Type with four (4) or less rooms (i.e. Capacity), determine if this is an accurate Inventory Type. Modifying an attribute’s shoppability on the Attribute Mapping screen from ‘yes’ to ‘no’ will likely reduce the number of unique Inventory Types to be managed going forward.</li>
    </ol>
  </div>
`;
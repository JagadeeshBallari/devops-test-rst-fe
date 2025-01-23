export const getTooltipContentInventoryItemAudit = (): string => `
  <div class='font-bold text-[14px] '>PHYSICAL GUESTROOM AUDIT</div>
  <div class='mt-1 text-[12px] font-light'>
    <ol class=" ml-6 space-y-2 mb-3" style="list-style-type: decimal;">
      <li>Please review and audit the shoppable attributes that have been identified for each physical guestroom.</li>
      <li>To add a missing shoppable attribute, click the “ADD SHOPPABLE ATTRIBUTE” button. In the pop-up box, select the appropriate Product Catalog Category and Attribute.</li>
      <li>If the attribute is not available in the drop-down list, click the ‘Return to Attribute Mapping’ and manually add the attribute first. Then return and add the attribute to the guestroom.</li>
      <li>If you need to delete an attribute that no longer applies, click the “X” next to the Attribute name.</li>
      <li>This report may be exported and downloaded if you prefer to conduct an offline review. Upon completion, return to this screen to make required updates.</li>
    </ol>
  </div>
`;

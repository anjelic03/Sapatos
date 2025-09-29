# Mini Shoe Cart

## Members

<table>
  <tr>
    <td align="center"><img src="images/Bonnel.jpg" alt="Bonnel Jhon I. Catipay" width="80" style="border-radius: 50%"><br>Bonnel Jhon I. Catipay</td>
    <td align="center"><img src="images/Cyrine.jpg" alt="Cyrine S. Ganloy" width="80" style="border-radius: 50%"><br>Cyrine S. Ganloy</td>
    <td align="center"><img src="images/John.jpg" alt="John Angelique G. Hernandez" width="80" style="border-radius: 50%"><br>John Angelique G. Hernandez</td>
  </tr>
</table>

# Sapatos

A Mini E-Commerce Shopping Cart Website. Built with HTML, CSS, and vanilla JavaScript to demonstrate creational, structural, and behavioral design patterns.

## Highlights
- **Creational – Product Factory:** `ProductFactory` builds consistent `Product` objects from catalog metadata.
- **Structural – Decorator:** Gift wrap, discount, and free shipping add-ons wrap products without changing the base class.
- **Behavioral – Observer:** The `Cart` notifies the cart list, totals panel, and header badge whenever items change.

Replace the placeholder SVGs inside `images/` with your actual product shots or logo to personalize the site.

## Manual Test Ideas
- Add each shoe to the cart and confirm quantity updates.
- Toggle each add-on to verify the total changes and labels update.
- Remove items and try checkout to see the toast confirmation.

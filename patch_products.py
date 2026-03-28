import re
from pathlib import Path

base = Path('c:/Users/tadeb/OneDrive/Documents/my ai project')
pages = [
    'mac.html', 'ipad.html', 'iphone.html', 'watch.html', 'airpods.html',
    'accessories.html', 'services.html', 'new-product-launch.html', 'tecno.html'
]

for p in pages:
    path = base / p
    text = path.read_text(encoding='utf-8')

    # ensure onShopNow exists after updateCartCount
    if 'function onShopNow' not in text:
        find = 'function updateCartCount(){'
        i = text.find(find)
        if i != -1:
            # find closing brace for updateCartCount
            j = text.find('}', i)
            if j != -1:
                j += 1
                snippet = "\n    function onShopNow(name,price,image){ addToCart(name,price,image); window.location.href='cart.html'; }\n"
                text = text[:j] + snippet + text[j:]

    # normalize button
    text = text.replace('onclick="addToCart(', 'onclick="onShopNow(')

    # replace renderProducts block
    pattern = re.compile(r'function renderProducts\(\)\{.*?renderProducts\(\);', re.S)
    m = pattern.search(text)
    if m:
        seg = m.group(0)
        if 'iphoneProducts' in seg:
            prod = 'iphoneProducts'
        elif 'macProducts' in seg:
            prod = 'macProducts'
        elif 'ipadProducts' in seg:
            prod = 'ipadProducts'
        elif 'watchProducts' in seg:
            prod = 'watchProducts'
        elif 'airpodsProducts' in seg:
            prod = 'airpodsProducts'
        elif 'accessoriesProducts' in seg:
            prod = 'accessoriesProducts'
        elif 'servicesProducts' in seg:
            prod = 'servicesProducts'
        elif 'launchProducts' in seg:
            prod = 'launchProducts'
        elif 'tecnoProducts' in seg:
            prod = 'tecnoProducts'
        else:
            prod = '[]'

        new_block = f"""    function renderProducts(){{
      const grid = document.getElementById('productGrid');
      grid.innerHTML = {prod}.map(p => `
        <div class='card'>
          <img src='${{p.image}}' alt='${{p.name}}' onerror=\"this.onerror=null;this.src='https://via.placeholder.com/400x300?text=No+Image'\"/>
          <div class='card-body'>
            <h3>${{p.name}}</h3>
            <p>${{p.tagline || ''}}</p>
            <div class='price'>₦${{p.price.toLocaleString()}}</div>
            <button class='btn-shop' onclick=\"onShopNow('${{p.name.replace("'","\\'" )}}', ${{p.price}}, '${{p.image}}')\">Shop now</button>
          </div>
        </div>
      `).join('');
    }}
    renderProducts();"""
        text = text[:m.start()] + new_block + text[m.end():]

    path.write_text(text, encoding='utf-8')
    print('patched', p)

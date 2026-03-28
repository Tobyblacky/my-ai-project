import pathlib, re
base = pathlib.Path(r'C:/Users/tadeb/OneDrive/Documents/my ai project')
pages = ['mac.html','ipad.html','iphone.html','watch.html','airpods.html','accessories.html','services.html','new-product-launch.html','tecno.html']
for p in pages:
    path = base / p
    text = path.read_text(encoding='utf-8')
    if 'function onShopNow' not in text:
        text = re.sub(r'(function addToCart\(.*?\}\s*)', r"\1    function onShopNow(name,price,image){ addToCart(name,price,image); window.location.href='cart.html'; }\n", text, flags=re.S, count=1)
        path.write_text(text, encoding='utf-8')
        print('onShopNow added in', p)
    else:
        print('onShopNow already in', p)

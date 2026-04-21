import requests

# 发送请求获取API响应
response = requests.get('http://localhost:8080/api/artworks?page=0&pageSize=2')

# 检查响应状态码
if response.status_code == 200:
    # 打印响应数据
    data = response.json()
    print('API Response:')
    print(f'Total: {data.get("total")}')
    print(f'Page: {data.get("page")}')
    print(f'Page Size: {data.get("pageSize")}')
    print(f'Total Pages: {data.get("totalPages")}')
    print('\nArtworks:')
    for artwork in data.get('data', []):
        print(f'\nID: {artwork.get("id")}')
        print(f'Title: {artwork.get("title")}')
        print(f'Artist: {artwork.get("artist")}')
        print(f'Category: {artwork.get("category")}')
        print(f'Image URL: {artwork.get("imageUrl")}')
else:
    print(f'Request failed with status code: {response.status_code}')
    print(f'Response text: {response.text}')

import re
import urllib.parse

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def repl(m):
    place_name = m.group(1).strip()
    
    search_query = place_name
    if '봉은사' in search_query: search_query = '봉은사'
    if '로데오' in search_query: search_query = '압구정로데오거리'
    if '청담 미술관' in search_query: search_query = '청담동'
    if 'Matt Cafe' in search_query: search_query = '매트카페'
    
    encoded_name = urllib.parse.quote(search_query)
    href = f'https://map.naver.com/p/directions/-/{encoded_name}'
    
    return f'<h3>{place_name}</h3>\n{m.group(2)}<a href="{href}" target="_blank" class="read-more">자세히 보기</a>'

pattern = r'<h3>(.*?)<\/h3>(\s*<p>.*?<\/p>\s*)<a href="#" class="read-more">자세히 보기<\/a>'
new_content = re.sub(pattern, repl, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

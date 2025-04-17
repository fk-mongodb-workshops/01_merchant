# Enable Atlas Search

![image](https://github.com/user-attachments/assets/2e2066ad-a2a6-4e35-a091-00fe602b2e45)

Create new search index
![image](https://github.com/user-attachments/assets/b9350bbd-4a9c-454b-87d4-ccd5afc40143)

Add this JSON

```
{
  "analyzer": "lucene.english",
  "searchAnalyzer": "lucene.english",
  "mappings": {
    "dynamic": false,
    "fields": {
      "my_story": {
        "analyzer": "lucene.english",
        "searchAnalyzer": "lucene.english",
        "type": "string"
      }
    }
  }
}
```

Search index is created
![image](https://github.com/user-attachments/assets/d82b249f-6373-4466-91be-c70e0d26dcc8)

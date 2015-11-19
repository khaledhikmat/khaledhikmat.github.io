---
layout: post
title:  "Azure Logic Apps Push Trigger"
date:   2015-11-15 20:14:01
summary: "Notes on Azure Logic Apps Push Triggers"
categories: Technical
tags: Azure, Logic Apps, Push Trigger
featured_image: /images/cover.jpg
---

Have been toying with Azure Logic Apps for a project I am working on. I wanted to run a Cloud-based workflow triggered by some events within some web app. This post discusses things I had to to go through to get push triggers working as triggered from web events.
 
## The local storage interface

Assuming you have a complex object represented here for simplicity by a Book. But it can be anything:

```
	public class Book
	{
        public string Title { get; set; }
        public string Author { get; set; }
	}
```

Let us create an interface for storing and retrieving a book from the local repository:

```
    public interface ILocalStorageService
    {
        Task<Book> RetrieveBook();
        Task<bool> StoreBook(Book book);
    }
``` 

## The local storage implementation

```
	public class LocalStorageService : ILocalStorageService
    {
        const string BookFileName = "localBook.json";

        public async Task<Book> RetrieveBook()
        {
            return await RetrieveObject<Book>(BookFileName);
        }

        public async Task<bool> StoreBook(Book book)
        {
            return await StoreObject<Book>(book, BookFileName);
        }

        /*** PRIVATE METHODS */
        private async Task<T> RetrieveObject<T>(string storageFileName)
        {
            StorageFile storageFile;

            try
            {
                storageFile = await ApplicationData.Current.LocalFolder.GetFileAsync(storageFileName);
            }
            catch (FileNotFoundException ex)
            {
                storageFile = null;
            }

            if (storageFile != null)
            {
                string data = await FileIO.ReadTextAsync(storageFile);
                return FromJson<T>(data);
            }

            return default(T);
        }

        private async Task<bool> StoreObject<T>(T requestObject, string storageFileName)
        {
            try
            {
                var data = ToJson<T>(requestObject);
                StorageFile localFile = await ApplicationData.Current.LocalFolder.CreateFileAsync(storageFileName, CreationCollisionOption.ReplaceExisting);
                await FileIO.WriteTextAsync(localFile, data);
                return true;
            }
            catch (FileNotFoundException ex)
            {
            }

            return false;
        }

        private string ToJson<T>(T requestObject)
        {
            var data = "";

            try
            {
                data = JsonConvert.SerializeObject(requestObject,
                                                      new JsonSerializerSettings()
                                                      {
                                                          NullValueHandling = NullValueHandling.Ignore
                                                      });
            }
            catch (Exception ex)
            {
            }

            return data;
        }

        private T FromJson<T>(string data)
        {
            T returnObject = JsonConvert.DeserializeObject<T>(data);
            return returnObject;
        }
    }
``` 

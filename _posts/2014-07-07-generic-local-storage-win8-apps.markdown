---
layout: post
title:  "Generic Local Storage Class for Win8 Apps"
date:   2014-07-07 20:14:01
summary: "A simple C# class to handle local storage of complex objects in Windows 8 apps"
categories: Technical
tags: C#, Win8
featured_image: /images/cover.jpg
---

A class in C# that can be used to store and retrieve complex objects to/from Win8 local storage. The class requires JSON.NET Nuget library and of course it relies on the Win8 StorageFile class (hence the Windows.Storage namespace).
 
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

---
layout: post
title:  "HTML to PDF and then Print"
date:   2013-09-05 20:14:01
summary: "A Procesing a print job from the server"
categories: Technical
tags: .NET HTML PDF PRINT
featured_image: /images/cover.jpg
---

In one component of a major project I am working on, it is required that we process a print job from a server. The .NET client component (i.e Windows Service) which receives the print jobs must convert the print job's HTML markup to PDF and print on one attached printers identified by name (in the print job).

Initially I thought, since we are on .NET, there must be zillions of free libraries to deal with this. It turned out this is not the case. I will explain the challenges that I ran into and then go on to describe one solution that worked well for me.

### The challenges:

* Convert the HTML to PDF
* Print to a non-default printer

The problem with the first one is that HTML cannot be easily parsed as XHTML! Therefore it is difficult to build the PDF on the fly (there are many libraries that can do this part). I found PDFizer that deals with this problem specifically but it has not been updated since 2004 and it lacks support for a lot of HTML tags which we are likely to receive in the job's HTML markup. Hence it not suitable for the job at hand.

The problem with the second challenge is that it is difficult to print to a non-default printer. The code below shows how to setup a print process but it expects the printer to be the default:

```
ProcessStartInfo info = new ProcessStartInfo();
info.Verb = "print";
info.FileName = pdfFilePath;//@"c:\output.pdf";
info.CreateNoWindow = true;
info.WindowStyle = ProcessWindowStyle.Hidden;

Process p = new Process();
p.StartInfo = info;
p.Start();

p.WaitForInputIdle();
System.Threading.Thread.Sleep(3000);
if (false == p.CloseMainWindow())
    p.Kill();
```

So one solution would be to set the default printer ahead of issuing the above command. To set the default printer, one has to resort to the Windows API. The following is one way of doing it. First you declare the Windows API that you are about to call (specifying the actual Windows DLL in the DllImport):

```
[DllImport("winspool.drv", CharSet = CharSet.Auto, SetLastError = true)]
public static extern bool SetDefaultPrinter(string name);
//public static extern string GetDefaultPrinter();
```

and then you call it this way:

```
if (MyPrinters.SetDefaultPrinter(printer))
{
// do the above
}
```

Ok...then...I wanted to be get the default printer, store it somewhere safe, set my print job's printer to be the default, print and then restore my original printer as default!! But I could not find out how to get the default printer...the Windows API does not have a 'GetDefaultPrinter'.

### The solution:

After searching on the Internet and trying numerous solutions, I found the only way to actually produce a faithful PDF from HTML in a very reasonable time is via EssentialObjects EO.PDF library for .NET! It is only a one line to convert the HTML markup to PDF and it is indeed great:

```
EO.Pdf.HtmlToPdf.ConvertHtml(html, pdfFilePath);
```

This solves my HTML to PDF conversion! One thing to note about Essential Objects is that the library is not free nor is it cheap! It costs about $650 per developer license. This could be a show stopper for many, but it is worth the price is you really have to convert HTML to PDF.

To solve my printing problem, I had to use the PDFSharp library and Adobe Acrobat Reader.

Once I had the DLL for PDF Sharp in my project and the Acrobat Reader installed on my machine, the code to print becomes trivial:

```
// Set the Acrobat Reader exe path:
PdfFilePrinter.AdobeReaderPath = acrobatReaderPath;

// Set the file to print and the Windows name of the printer.
PdfFilePrinter pdfPrinter = new PdfFilePrinter(pdfFilePath, printer);

pdfPrinter.Print();
```

One thing to note, the Acrobat Reader path must point to EXE (not the directory). In my machine, it is here:
C:\Program Files (x86)\Adobe\Reader 11.0\Reader\AcroRd32.exe

There you have it.... an HTML to PDF and then to the printer. I actually used the following interface to describe the print driver:

```
public interface IPrintDriver
{
    void Print(string acrobatReaderExePath, string html, string printer);
    void Convert2Pdf(string pdfFilePath, string html);
    void PrintPdf(string acrobatReaderPath, string pdfFilePath, string printer);
    string GetPdfFilePath();
}
```
package com.example.employeeapp.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.reader.pdf.config.PdfDocumentReaderConfig;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class DocumentService {

    private final VectorStore vectorStore;

    public DocumentService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void uploadDocument(MultipartFile file) throws IOException {

        PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(
                new InputStreamResource(file.getInputStream()),
                PdfDocumentReaderConfig.defaultConfig());

        List<Document> documents = pdfReader.get();

        TokenTextSplitter textSplitter = TokenTextSplitter.builder().build();

        List<Document> chunks = textSplitter.apply(documents);

        vectorStore.add(chunks);
    }
}
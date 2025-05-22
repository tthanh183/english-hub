package com.example.englishhubbackend.util;

public class S3Util {
  public static String getFileName(String url) {
    return url.substring(url.lastIndexOf("/") + 1);
  }
}

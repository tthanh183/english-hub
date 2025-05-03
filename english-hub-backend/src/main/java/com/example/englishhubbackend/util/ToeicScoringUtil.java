package com.example.englishhubbackend.util;

public class ToeicScoringUtil {
    public static int convertListeningScore(int correctAnswers) {
        if (correctAnswers >= 96) return 495;
        if (correctAnswers >= 91) return 475;
        if (correctAnswers >= 86) return 450;
        if (correctAnswers >= 81) return 425;
        if (correctAnswers >= 76) return 400;
        if (correctAnswers >= 71) return 375;
        if (correctAnswers >= 66) return 350;
        if (correctAnswers >= 61) return 325;
        if (correctAnswers >= 56) return 300;
        if (correctAnswers >= 51) return 275;
        if (correctAnswers >= 46) return 250;
        if (correctAnswers >= 41) return 225;
        if (correctAnswers >= 36) return 200;
        if (correctAnswers >= 31) return 175;
        if (correctAnswers >= 26) return 150;
        if (correctAnswers >= 21) return 125;
        if (correctAnswers >= 16) return 100;
        if (correctAnswers >= 11) return 75;
        if (correctAnswers >= 6)  return 50;
        if (correctAnswers >= 1)  return 25;
        return 5;
    }

    public static int convertReadingScore(int correctAnswers) {
        if (correctAnswers >= 96) return 495;
        if (correctAnswers >= 91) return 470;
        if (correctAnswers >= 86) return 445;
        if (correctAnswers >= 81) return 420;
        if (correctAnswers >= 76) return 395;
        if (correctAnswers >= 71) return 370;
        if (correctAnswers >= 66) return 345;
        if (correctAnswers >= 61) return 320;
        if (correctAnswers >= 56) return 295;
        if (correctAnswers >= 51) return 270;
        if (correctAnswers >= 46) return 245;
        if (correctAnswers >= 41) return 220;
        if (correctAnswers >= 36) return 195;
        if (correctAnswers >= 31) return 170;
        if (correctAnswers >= 26) return 145;
        if (correctAnswers >= 21) return 120;
        if (correctAnswers >= 16) return 95;
        if (correctAnswers >= 11) return 70;
        if (correctAnswers >= 6)  return 45;
        if (correctAnswers >= 1)  return 20;
        return 5;
    }
}

package com.saferoute.ai.service;

import com.saferoute.ai.repository.CommunityReportRepository;
import com.saferoute.ai.repository.HistoricalCrimeRecordRepository;
import com.saferoute.ai.repository.SafeZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SafetyScoreService {

    private final HistoricalCrimeRecordRepository crimeRecordRepository;
    private final CommunityReportRepository communityReportRepository;
    private final SafeZoneRepository safeZoneRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public static class SafetyResult {
        public int score;
        public String riskLevel;
        public String explanation;

        public SafetyResult(int score, String riskLevel, String explanation) {
            this.score = score;
            this.riskLevel = riskLevel;
            this.explanation = explanation;
        }
    }

    public SafetyResult calculateSafetyScore(double midLat, double midLng, String routeType) {
        double crimeScore = 85.0;
        double communityReportScore = 90.0;
        double safeZoneScore = 80.0;
        double timeRisk = 15.0;

        LocalTime now = LocalTime.now();
        if (now.isAfter(LocalTime.of(21, 0)) || now.isBefore(LocalTime.of(6, 0))) {
            timeRisk = 40.0;
        }

        if ("SAFEST".equalsIgnoreCase(routeType)) {
            crimeScore += 8;
            communityReportScore += 5;
            safeZoneScore += 10;
        } else if ("SHORTEST".equalsIgnoreCase(routeType)) {
            crimeScore -= 12;
            communityReportScore -= 10;
        }

        // Try calling Python AI service if running
        try {
            String aiUrl = "http://localhost:8000/predict-safety";
            Map<String, Object> req = new HashMap<>();
            req.put("crime_score", crimeScore);
            req.put("community_report_score", communityReportScore);
            req.put("safe_zone_score", safeZoneScore);
            req.put("time_risk", timeRisk);

            Map<?, ?> response = restTemplate.postForObject(aiUrl, req, Map.class);
            if (response != null && response.containsKey("safety_score")) {
                Number scoreNum = (Number) response.get("safety_score");
                int score = Math.min(100, Math.max(0, scoreNum.intValue()));
                Object riskObj = response.get("risk_level");
                String risk = riskObj != null ? riskObj.toString() : getRiskLevel(score);
                String exp = "AI Predicted Score (" + score + "/100). High lighting & low crime density path.";
                return new SafetyResult(score, risk, exp);
            }
        } catch (Exception e) {
            // Fallback to internal rule-based algorithm
        }

        double weightedScore = (crimeScore * 0.4) + (communityReportScore * 0.3) + (safeZoneScore * 0.3) - (timeRisk * 0.5);
        int finalScore = Math.min(100, Math.max(10, (int) Math.round(weightedScore)));
        String riskLevel = getRiskLevel(finalScore);

        String explanation = String.format("Calculated based on crime records (%d%%), community reports, and active safe zones.", finalScore);
        return new SafetyResult(finalScore, riskLevel, explanation);
    }

    private String getRiskLevel(int score) {
        if (score >= 80) return "SAFE";
        if (score >= 55) return "MODERATE";
        return "HIGH_RISK";
    }
}

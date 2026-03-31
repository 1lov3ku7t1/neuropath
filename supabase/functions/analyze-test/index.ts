import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { test_type, test_data } = await req.json();

    if (!test_type || !test_data) {
      return new Response(
        JSON.stringify({ error: "test_type and test_data are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (test_type) {
      case "spiral_drawing":
        systemPrompt = `You are a medical AI assistant specializing in Parkinson's disease detection through spiral drawing analysis. Analyze the drawing metrics provided and assess the risk of Parkinson's disease based on:
- Tremor indicators (jitter, deviation from ideal spiral path)
- Line steadiness (variance in stroke speed, pressure consistency)
- Motor control (smoothness of curves, ability to maintain spiral pattern)

IMPORTANT: This is a screening tool only, not a diagnosis. Always recommend consulting a neurologist.

Respond with ONLY valid JSON in this exact format:
{"score": <0-100 number>, "risk_level": "<low|moderate|high>", "analysis": "<detailed analysis>", "recommendations": ["<rec1>", "<rec2>", "<rec3>"]}`;
        userPrompt = `Analyze these spiral drawing metrics for Parkinson's indicators:\n${JSON.stringify(test_data)}`;
        break;

      case "voice_analysis":
        systemPrompt = `You are a medical AI assistant specializing in Parkinson's disease detection through voice analysis. Analyze the voice metrics provided and assess based on:
- Vocal tremor (jitter, shimmer in voice frequency)
- Monotone speech patterns (reduced pitch variation)
- Dysarthria indicators (slurred or slow speech)
- Volume control (hypophonia - abnormally soft voice)

IMPORTANT: This is a screening tool only, not a diagnosis.

Respond with ONLY valid JSON in this exact format:
{"score": <0-100 number>, "risk_level": "<low|moderate|high>", "analysis": "<detailed analysis>", "recommendations": ["<rec1>", "<rec2>", "<rec3>"]}`;
        userPrompt = `Analyze these voice recording metrics for Parkinson's indicators:\n${JSON.stringify(test_data)}`;
        break;

      case "symptom_questionnaire":
        systemPrompt = `You are a medical AI assistant specializing in Parkinson's disease risk assessment. Analyze the symptom questionnaire responses and provide a risk assessment based on known PD symptoms:
- Motor symptoms (tremor, rigidity, bradykinesia, postural instability)
- Non-motor symptoms (sleep disorders, depression, constipation, loss of smell)
- Symptom progression and duration

IMPORTANT: This is a screening tool only, not a diagnosis.

Respond with ONLY valid JSON in this exact format:
{"score": <0-100 number>, "risk_level": "<low|moderate|high>", "analysis": "<detailed analysis>", "recommendations": ["<rec1>", "<rec2>", "<rec3>"]}`;
        userPrompt = `Analyze these symptom questionnaire responses for Parkinson's risk:\n${JSON.stringify(test_data)}`;
        break;

      case "finger_tapping":
        systemPrompt = `You are a medical AI assistant specializing in Parkinson's disease detection through finger tapping analysis. Analyze the tapping metrics and assess based on:
- Bradykinesia (slowness of movement, decreasing amplitude)
- Rhythm regularity (consistency of tapping intervals)
- Fatigue pattern (decrement in speed/amplitude over time)
- Asymmetry between hands

IMPORTANT: This is a screening tool only, not a diagnosis.

Respond with ONLY valid JSON in this exact format:
{"score": <0-100 number>, "risk_level": "<low|moderate|high>", "analysis": "<detailed analysis>", "recommendations": ["<rec1>", "<rec2>", "<rec3>"]}`;
        userPrompt = `Analyze these finger tapping metrics for Parkinson's indicators:\n${JSON.stringify(test_data)}`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid test_type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from the AI
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-test error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

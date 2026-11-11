import { NextResponse } from "next/server";

type RequestBody = { type?: string; productName?: string; details?: string; platform?: string };

function demoCopy(type: string, name: string, details: string, platform: string) {
  const detail = details.trim().replace(/[.!?]+$/, "");
  if (type === "SEO package") return `SEO title: ${name} | Thoughtful essentials for everyday\n\nKeywords: ${name.toLowerCase()}, everyday essentials, thoughtful design, quality goods\n\nMeta description: Meet the ${name}, made for the moments that make a day. ${detail}. Shop the collection at Studio Supply Co.`;
  if (type === "Social post") {
    if (platform === "TikTok") return `A little reminder that everyday can feel special ✨ Meet the ${name} — ${detail.toLowerCase()}. Would you wear/use this on repeat?\n\n#SmallBusiness #EverydayStyle #ShopSmall`;
    if (platform === "Facebook") return `Something lovely just landed at Studio Supply Co. 💛 Say hello to the ${name}. ${detail}. Find your new favorite and tell us how you’d style it!\n\n#ShopSmall #ThoughtfulLiving`;
    return `Meet your new everyday favorite ✨ The ${name} is here, and it’s made for the moments that make a day. ${detail}. Save this for a little inspiration 💛\n\n#StudioSupply #EverydayEssentials #ShopSmall`;
  }
  return `${name} — the everyday piece you’ll reach for again and again. ${detail}. Thoughtfully made, easy to love, and ready to make itself at home in your routine.`;
}

export async function POST(request: Request) {
  let body: RequestBody;
  try { body = await request.json() as RequestBody; }
  catch { return NextResponse.json({ error: "Please send valid JSON." }, { status: 400 }); }

  const type = body.type?.trim();
  const productName = body.productName?.trim();
  const details = body.details?.trim();
  const platform = body.platform?.trim() || "Instagram";
  if (!type || !productName || !details) return NextResponse.json({ error: "Type, product name, and product details are required." }, { status: 400 });
  if (productName.length > 160 || details.length > 2000) return NextResponse.json({ error: "Product name or details are too long." }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ content: demoCopy(type, productName, details, platform), mode: "demo" as const });

  try {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.7, max_tokens: 500, messages: [
        { role: "system", content: "You are a thoughtful ecommerce copywriter for an independent lifestyle shop. Write useful, natural, polished English copy. Follow the requested output format exactly. Never invent product facts beyond those supplied." },
        { role: "user", content: `Create a ${type} for this product.\nProduct name: ${productName}\nProduct facts: ${details}\n${type === "Social post" ? `Platform: ${platform}` : ""}\nFor SEO package, return an SEO title, keyword list, and meta description. For a social post, include suitable platform-native copy and a few relevant hashtags.` },
      ] }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
      console.error("OpenAI generation failed:", response.status, err.error?.message || "Unknown error");
      return NextResponse.json({ error: "OpenAI could not generate copy. Check your API key, account access, and available balance, then try again." }, { status: 502 });
    }
    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return NextResponse.json({ error: "The AI returned an empty response. Please try again." }, { status: 502 });
    return NextResponse.json({ content, mode: "openai" as const });
  } catch (error) {
    console.error("OpenAI request error:", error);
    return NextResponse.json({ error: "Could not reach OpenAI. Please check your connection and try again." }, { status: 502 });
  }
}

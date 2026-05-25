import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// Handle Verification Link click
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // 1. Find the profile with this token (either exact match or suffix match)
    let profile = null;
    
    // First, try exact match for backward compatibility
    const { data: exactProfile } = await supabase
      .from("profiles")
      .select("id, token_expires_at, verification_token")
      .eq("verification_token", token)
      .maybeSingle();

    if (exactProfile) {
      profile = exactProfile;
    } else {
      // Second, try suffix match for composite tokens: `%_${token}`
      const { data: suffixProfile } = await supabase
        .from("profiles")
        .select("id, token_expires_at, verification_token")
        .like("verification_token", `%_${token}`)
        .maybeSingle();
      
      profile = suffixProfile;
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Verification link is invalid or has expired." },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (profile.token_expires_at) {
      const expiresAt = new Date(profile.token_expires_at);
      if (expiresAt.getTime() < Date.now()) {
        return NextResponse.json(
          { error: "Verification link has expired. Please sign up again." },
          { status: 400 }
        );
      }
    }

    // 2. Activate the user account by setting is_verified = true
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_verified: true,
        verification_token: null,
        token_expires_at: null,
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Database update error during verification:", updateError);
      return NextResponse.json(
        { error: "Failed to activate your account in the database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your email has been successfully verified! You can now log in.",
    });
  } catch (error: any) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OTP Form submission
export async function POST(request: Request) {
  try {
    const { otp, userId } = await request.json();

    if (!otp || !userId) {
      return NextResponse.json(
        { error: "OTP code and user ID are required" },
        { status: 400 }
      );
    }

    // 1. Find the profile with this userId
    const { data: profile, error: selectError } = await supabase
      .from("profiles")
      .select("id, token_expires_at, verification_token")
      .eq("id", userId)
      .single();

    if (selectError || !profile) {
      return NextResponse.json(
        { error: "User profile not found. Please sign up again." },
        { status: 404 }
      );
    }

    // Check if verification_token exists and has the expected composite format
    const dbToken = profile.verification_token;
    if (!dbToken) {
      return NextResponse.json(
        { error: "This account has already been verified or no OTP is active. Please login." },
        { status: 400 }
      );
    }

    // Extract the OTP part from the composite token (format: otp_token)
    const parts = dbToken.split("_");
    const storedOtp = parts[0];

    if (storedOtp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP code. Please check your email." },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (profile.token_expires_at) {
      const expiresAt = new Date(profile.token_expires_at);
      if (expiresAt.getTime() < Date.now()) {
        return NextResponse.json(
          { error: "OTP code has expired. Please sign up again to get a new code." },
          { status: 400 }
        );
      }
    }

    // 2. Activate the user account by setting is_verified = true
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_verified: true,
        verification_token: null,
        token_expires_at: null,
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Database update error during OTP verification:", updateError);
      return NextResponse.json(
        { error: "Failed to activate your account in the database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your email has been successfully verified! You can now log in.",
    });
  } catch (error: any) {
    console.error("OTP verification endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

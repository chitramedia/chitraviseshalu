import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const user = authData?.user;
    if (!user) {
      // If user is null and there is no error, it means email is already registered
      return NextResponse.json(
        { error: "This email is already registered. Please go to the Log In tab to sign in or verify your account." },
        { status: 400 }
      );
    }

    // 2. Generate a secure, unique verification token and a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

    // Combine OTP and token to store in the verification_token field (format: otp_token)
    const compositeToken = `${otp}_${token}`;

    // Save/upsert the verification token to the profiles table
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        is_verified: false,
        verification_token: compositeToken,
        token_expires_at: expiresAt.toISOString(),
      });

    if (dbError) {
      console.error("Database upsert error during registration:", dbError);
      return NextResponse.json(
        { error: "Failed to initialize verification state in database: " + dbError.message },
        { status: 500 }
      );
    }

    // 3. Construct verification link
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;
    const verificationLink = `${origin}/verify?token=${token}`;

    // 4. Send the verification email using Nodemailer
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || `"Chitra Viseshalu" <no-reply@chitraviseshalu.com>`;

    let transporter;
    let isMockMail = false;
    let testMailUrl = "";

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      // Check if it's Gmail or a custom Google Account SMTP
      const isGmail = smtpHost.includes("gmail.com") || smtpUser.includes("@gmail.com");
      
      transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: "gmail",
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            }
          : {
              host: smtpHost,
              port: parseInt(smtpPort),
              secure: parseInt(smtpPort) === 465,
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            }
      );
    } else {
      // Fallback: Create test Ethereal SMTP account if no credentials are provided
      console.log("No SMTP credentials found in environment variables. Setting up test Ethereal Mail...");
      isMockMail = true;
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } catch (err) {
        console.error("Failed to create Ethereal Mail account:", err);
        transporter = null;
      }
    }

    const emailSubject = "Confirm your Chitra Viseshalu account";
    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #111111; color: #ffffff; padding: 40px 20px; text-align: center; max-width: 600px; margin: 0 auto; border-radius: 24px; border: 1px solid #27272a;">
        <div style="margin-bottom: 24px;">
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #ffffff; box-shadow: 0 0 15px rgba(255,255,255,0.8); margin-right: 8px;"></span>
          <h1 style="display: inline-block; font-size: 24px; font-weight: 800; letter-spacing: 0.05em; color: #ffffff; margin: 0; vertical-align: middle;">CHITRA VISESHALU</h1>
        </div>
        <hr style="border: 0; border-top: 1px solid #27272a; margin-bottom: 30px;" />
        <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 16px; color: #ffffff;">Verify Your Account</h2>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; max-width: 460px; margin: 0 auto 20px auto;">
          Welcome to your ultimate cinematic journey. Use the OTP code below to verify your account immediately, or click the verification link.
        </p>
        
        <!-- OTP Code Box -->
        <div style="margin: 25px auto; padding: 15px 30px; background-color: #1a1a1a; border: 1px solid #27272a; border-radius: 16px; display: inline-block;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #ffffff;">${otp}</span>
        </div>
        
        <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 25px;">
          Or click the button below to verify directly:
        </p>
        
        <div style="margin-bottom: 30px;">
          <a href="${verificationLink}" style="display: inline-block; background-color: #ffffff; color: #111111; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 36px; border-radius: 9999px; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #71717a; font-size: 12px; margin-bottom: 20px;">
          This code and link will expire in 24 hours. If you did not sign up for Chitra Viseshalu, please ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #27272a; margin-bottom: 20px;" />
        <p style="color: #71717a; font-size: 11px; margin: 0;">
          If the button doesn't work, copy and paste this link into your browser: <br />
          <a href="${verificationLink}" style="color: #a1a1aa; text-decoration: underline;">${verificationLink}</a>
        </p>
      </div>
    `;

    if (transporter) {
      const info = await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: emailSubject,
        html: emailHtml,
      });

      if (isMockMail) {
        testMailUrl = nodemailer.getTestMessageUrl(info) || "";
        console.log(`\n======================================================`);
        console.log(`[TEST EMAIL SENT]`);
        console.log(`Recipient: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`Verification Link: ${verificationLink}`);
        console.log(`Ethereal Mail Preview URL: ${testMailUrl}`);
        console.log(`======================================================\n`);
      }
    } else {
      console.log(`\n======================================================`);
      console.log(`[CONSOLE FALLBACK: EMAIL NOT SENT]`);
      console.log(`Recipient: ${email}`);
      console.log(`OTP Code: ${otp}`);
      console.log(`Verification Link: ${verificationLink}`);
      console.log(`======================================================\n`);
    }

    return NextResponse.json({
      success: true,
      message: "Account created! A verification email has been sent.",
      userId: user.id,
      // Include the OTP and link in local development for easier testing without checking email
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
      verificationLink: process.env.NODE_ENV === "development" ? verificationLink : undefined,
      testMailUrl: isMockMail && testMailUrl ? testMailUrl : undefined,
    });
  } catch (error: any) {
    console.error("Registration endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

#!/bin/bash
# Script to check required environment variables in Vercel

echo "Checking Vercel environment variables..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed. Install with: npm i -g vercel"
    exit 1
fi

echo "Required environment variables for NextAuth:"
echo "-------------------------------------------"

# List of required variables
REQUIRED_VARS=("GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET" "AUTH_SECRET")

# Check each variable
for var in "${REQUIRED_VARS[@]}"; do
    # Try to get the variable from Vercel
    if vercel env ls 2>/dev/null | grep -q "^$var"; then
        echo "✓ $var is set"
    else
        echo "❌ $var is MISSING"
    fi
done

echo ""
echo "To add missing variables, run:"
echo "  vercel env add <VARIABLE_NAME>"
echo ""
echo "Or set them in Vercel Dashboard:"
echo "  Settings → Environment Variables"

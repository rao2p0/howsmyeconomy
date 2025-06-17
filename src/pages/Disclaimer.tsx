import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Info, Shield, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-4 gap-2"
            >
              <ArrowLeft size={16} />
              Back to Economy Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-playful font-bold text-shadow-fun mb-2">
              📋 Disclaimer & Legal Stuff
            </h1>
            <p className="text-xl text-blue-200 font-medium">
              The important but boring bits 🎭
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid gap-8">
          {/* Main Disclaimer */}
          <Card className="border-4 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-red-700">
                <AlertTriangle className="text-red-600" size={28} />
                🚨 Not Financial Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-semibold text-red-800">
                This website is for educational and entertainment purposes only. We are NOT providing financial, investment, or economic advice.
              </p>
              <div className="bg-white/80 p-4 rounded-lg border-2 border-red-200">
                <p className="text-gray-800 font-medium">
                  <strong>Think of us as:</strong> Your economics-savvy friend who makes data fun to understand
                </p>
                <p className="text-gray-800 font-medium mt-2">
                  <strong>We are NOT:</strong> Financial advisors, investment professionals, or economic forecasters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What This Actually Is */}
          <Card className="border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-blue-700">
                <Info className="text-blue-600" size={28} />
                🎯 What This Actually Is
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📊</span>
                  <span>A fun way to visualize and understand economic data from the Federal Reserve</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🎓</span>
                  <span>Educational content to help people learn about economic indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🎭</span>
                  <span>Entertainment that makes complex data more accessible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">🔍</span>
                  <span>A "vibe check" on current economic conditions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Source & Limitations */}
          <Card className="border-4 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-green-700">
                <BookOpen className="text-green-600" size={28} />
                📈 About Our Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p><strong>Data Source:</strong> Federal Reserve Economic Data (FRED)</p>
                <p><strong>Update Frequency:</strong> Economic indicators are typically updated monthly</p>
                <p><strong>Historical Nature:</strong> All data reflects past performance and current conditions</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ Important: Past economic performance does not predict future results
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Advice */}
          <Card className="border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-purple-700">
                <Shield className="text-purple-600" size={28} />
                💼 Seek Professional Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                For actual financial decisions, please consult with qualified professionals:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Licensed financial advisors</li>
                <li>• Certified public accountants (CPAs)</li>
                <li>• Investment professionals</li>
                <li>• Economic research firms</li>
              </ul>
              <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-300">
                <p className="text-purple-800 font-semibold">
                  💡 We help you understand the economy; they help you navigate your finances!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Line */}
          <Card className="border-4 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-playful text-yellow-700">
                🎉 The Bottom Line
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xl text-yellow-800 font-semibold mb-4">
                We're here to make economics fun and accessible, not to manage your money!
              </p>
              <p className="text-lg text-yellow-700">
                Enjoy the economic mood check, learn something new, and always make informed decisions with proper guidance! ✨
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link to="/">
            <Button className="text-lg px-8 py-3 font-playful font-bold">
              🏠 Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
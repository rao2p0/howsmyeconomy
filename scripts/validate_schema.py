#!/usr/bin/env python3
"""
Schema Validation Script

Validates the schema.json file to ensure:
- All required fields are present
- FRED series IDs are valid format
- Messages are appropriate length
- Categories are consistent
- No duplicate metrics

Usage:
    python scripts/validate_schema.py [--schema-file PATH]
"""

import json
import argparse
import re
from typing import List, Dict, Set

def validate_fred_series_id(series_id: str) -> bool:
    """Validate FRED series ID format"""
    # FRED series IDs are typically uppercase alphanumeric with some special chars
    pattern = r'^[A-Z0-9_]+$'
    return bool(re.match(pattern, series_id))

def validate_metric(metric: Dict, index: int) -> List[str]:
    """Validate a single metric configuration"""
    errors = []
    
    # Required fields
    required_fields = [
        'id', 'name', 'description', 'category', 'units', 
        'update_frequency', 'yay_message', 'meh_message', 'nay_message'
    ]
    
    for field in required_fields:
        if field not in metric:
            errors.append(f"Metric {index}: Missing required field '{field}'")
        elif not metric[field] or not str(metric[field]).strip():
            errors.append(f"Metric {index}: Field '{field}' is empty")
    
    if 'id' in metric:
        # Validate FRED series ID format
        if not validate_fred_series_id(metric['id']):
            errors.append(f"Metric {index} ({metric['id']}): Invalid FRED series ID format")
    
    # Validate message lengths
    message_fields = ['yay_message', 'meh_message', 'nay_message']
    for field in message_fields:
        if field in metric and len(metric[field]) > 100:
            errors.append(f"Metric {index} ({metric.get('id', 'unknown')}): {field} too long ({len(metric[field])} chars, max 100)")
    
    # Validate description length
    if 'description' in metric and len(metric['description']) > 200:
        errors.append(f"Metric {index} ({metric.get('id', 'unknown')}): description too long ({len(metric['description'])} chars, max 200)")
    
    # Validate category
    valid_categories = [
        'housing', 'automotive', 'employment', 'inflation', 
        'healthcare', 'education', 'retirement', 'utilities', 
        'wages', 'emergency'
    ]
    
    if 'category' in metric and metric['category'] not in valid_categories:
        errors.append(f"Metric {index} ({metric.get('id', 'unknown')}): Invalid category '{metric['category']}'. Valid: {', '.join(valid_categories)}")
    
    # Validate update frequency
    valid_frequencies = ['daily', 'weekly', 'monthly', 'quarterly', 'annually']
    if 'update_frequency' in metric and metric['update_frequency'] not in valid_frequencies:
        errors.append(f"Metric {index} ({metric.get('id', 'unknown')}): Invalid update_frequency '{metric['update_frequency']}'. Valid: {', '.join(valid_frequencies)}")
    
    return errors

def validate_schema(schema_file: str = "schema.json") -> bool:
    """Validate the entire schema file"""
    print(f"🔍 Validating schema file: {schema_file}")
    
    try:
        with open(schema_file, 'r') as f:
            schema = json.load(f)
    except FileNotFoundError:
        print(f"❌ Schema file not found: {schema_file}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in schema file: {e}")
        return False
    
    errors = []
    warnings = []
    
    # Check top-level structure
    if 'schema_version' not in schema:
        warnings.append("Missing 'schema_version' field")
    
    if 'metrics_to_track' not in schema:
        errors.append("Missing 'metrics_to_track' array")
        return False
    
    metrics = schema['metrics_to_track']
    
    if not isinstance(metrics, list):
        errors.append("'metrics_to_track' must be an array")
        return False
    
    if not metrics:
        errors.append("'metrics_to_track' array is empty")
        return False
    
    print(f"📊 Found {len(metrics)} metrics to validate")
    
    # Validate each metric
    series_ids: Set[str] = set()
    categories: Set[str] = set()
    
    for i, metric in enumerate(metrics):
        if not isinstance(metric, dict):
            errors.append(f"Metric {i}: Must be an object, got {type(metric)}")
            continue
        
        metric_errors = validate_metric(metric, i)
        errors.extend(metric_errors)
        
        # Check for duplicate series IDs
        if 'id' in metric:
            if metric['id'] in series_ids:
                errors.append(f"Metric {i} ({metric['id']}): Duplicate series ID")
            else:
                series_ids.add(metric['id'])
        
        # Collect categories
        if 'category' in metric:
            categories.add(metric['category'])
    
    # Summary statistics
    print(f"\n📈 VALIDATION SUMMARY")
    print(f"   Total metrics: {len(metrics)}")
    print(f"   Unique series IDs: {len(series_ids)}")
    print(f"   Categories used: {len(categories)}")
    print(f"   Categories: {', '.join(sorted(categories))}")
    
    # Report warnings
    if warnings:
        print(f"\n⚠️  WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"   • {warning}")
    
    # Report errors
    if errors:
        print(f"\n❌ ERRORS ({len(errors)}):")
        for error in errors:
            print(f"   • {error}")
        return False
    else:
        print(f"\n✅ Schema validation passed!")
        return True

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Validate FRED schema file')
    parser.add_argument('--schema-file', type=str, default='schema.json',
                       help='Path to schema file to validate')
    
    args = parser.parse_args()
    
    success = validate_schema(args.schema_file)
    
    if not success:
        exit(1)

if __name__ == "__main__":
    main() 
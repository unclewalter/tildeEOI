import base64, hmac, sha, json
from pprint import pprint
private_key = ''

with open('aws-config.json') as data_file:
    data = json.load(data_file)

private_key = json.dumps(data['secretAccessKey']).strip('"')

access_key = json.dumps(data['accessKeyId']).strip('"')

print "accessKeyId: %s\n" % access_key

input = open("eoi-s3-policy.json", "rb")
policy = input.read()
policy_encoded = base64.b64encode(policy)
signature = base64.b64encode(hmac.new(private_key, policy_encoded, sha).digest())
print "Policy base-64 encoded: %s\n" % (policy_encoded)
print "Signature base-64 encoded: %s" % (signature)

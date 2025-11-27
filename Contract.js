const CONTRACT_ADDRESS = "0xa75aB5f6358CEabBEE5d90B7915BeBD8735D3927";

const ABI = [
  "function registerDocument(bytes32 hash, address holder, string title, string holderName, string enrollmentNo, string ipfsCid) public",
  "function revokeDocument(bytes32 hash) public",
  "function getDocument(bytes32 hash) external view returns (address issuer, address holder, string title, string holderName, string enrollmentNo, string ipfsCid, uint256 timestamp, bool revoked)",
  "function getDocsByHolder(address holder) external view returns (bytes32[])",
  "function getDocsByIssuer(address issuer) external view returns (bytes32[])",
  "function issuers(address) external view returns (bool)",
  "function addIssuer(address issuer) external"
];

async function fileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return "0x" + Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function uploadToPinata(file, PINATA_JWT) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let data = new FormData();
  data.append("file", file);
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: data
  });
  if (!res.ok) throw new Error("Pinata upload failed");
  const result = await res.json();
  return result.IpfsHash;
}
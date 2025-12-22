import { useState } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
import { QRCodeSVG } from 'qrcode.react'
import Modal from './Modal'

interface WalletConnectModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (address: string) => void
}

export default function WalletConnectModal({ isOpen, onClose, onSuccess }: WalletConnectModalProps) {
    const [connecting, setConnecting] = useState(false)
    const [qrUri, setQrUri] = useState<string>('')

    const saveWallet = async (chain: string, address: string, label?: string) => {
        try {
            if (window.api && window.api.addWallet) {
                await window.api.addWallet({
                    chain,
                    address,
                    label: label || null,
                    is_active: true
                })
            }
        } catch (error) {
            console.error('Error adding wallet:', error)
            throw error
        }
    }

    const startConnection = async () => {
        setConnecting(true)
        setQrUri('')
        try {
            const provider = new WalletConnectProvider({
                qrcode: false,
                rpc: {
                    1: "https://cloudflare-eth.com",
                    137: "https://polygon-rpc.com",
                },
            })

            provider.on("display_uri", (uri: string) => {
                console.log("WalletConnect display_uri:", uri)
                setQrUri(uri)
            })

            if (provider.connector) {
                provider.connector.on("display_uri", (error, payload) => {
                    if (error) {
                        console.error("Connector display_uri error:", error)
                        return
                    }
                    const uri = payload.params[0]
                    console.log("Connector display_uri:", uri)
                    setQrUri(uri)
                })
            }

            await provider.enable()

            const web3Provider = new ethers.BrowserProvider(provider)
            const signer = await web3Provider.getSigner()
            const address = await signer.getAddress()

            if (address) {
                await saveWallet('ETH', address, 'WalletConnect')
                if (onSuccess) onSuccess(address)
                onClose()
            }
            await provider.disconnect()
        } catch (error) {
            console.error("WalletConnect Error:", error)
            setQrUri('')
        } finally {
            setConnecting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Connect Wallet"
        >
            <div className="qr-container">
                <p className="text-center mb-3">Scan this QR code with your mobile wallet (MetaMask, Rainbow, Trust, etc.)</p>
                <div className={`qr-placeholder ${qrUri ? 'has-qr' : ''}`}>
                    {qrUri ? (
                        <QRCodeSVG value={qrUri} size={180} />
                    ) : (
                        !connecting && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-cyan)', textAlign: 'center' }}>
                                HANDSHAKE NOT STARTED
                            </div>
                        )
                    )}
                </div>
                <button
                    className="btn btn-primary mt-4"
                    onClick={startConnection}
                    disabled={connecting}
                >
                    {connecting ? 'INITIALIZING...' : 'GENERATE CONNECTION'}
                </button>
                {connecting && !qrUri && (
                    <p className="text-muted mt-2" style={{ fontSize: '0.7rem' }}>
                        Waiting for secure handshake...
                    </p>
                )}
            </div>
        </Modal>
    )
}

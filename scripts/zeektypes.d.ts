declare namespace zeektypes {
    interface Port {
        port: BigInt,
        proto: string,
    }

    interface conn_id {
        orig_h: string,
        orig_p: Port,
        resp_h: string,
        resp_p: Port,
    }

    interface endpoint {
        num_bytes_ip?: BigInt,
        flow_label: BigInt,
        l2_addr?: string,
        state: BigInt,
        num_pkts?: BigInt,
        size: BigInt,
    }

    interface connection {
        id: conn_id,
        orig: endpoint,
        resp: endpoint,
        extract_resp?: boolean,
        ftp_data_reuse?: boolean,
        vlan?: Number,
        service_violation?: string[],
        service: string[],
        uid: string,
        duration: Number,
        extract_orig?: boolean,
        start_time: Number,
        inner_vlan?: Number,
        history: string,
        // tunnel?: Tunnel_EncapsulatingConn[],
        // dce_rpc_backing?: {[key: countDCE_RPC_BackingState]: DCE_RPC_BackingState },
        // removal_hooks?: function[],
    }
    interface Notice_Info {
        id: conn_id,
        conn: connection,
        uid?: string,
        file_desc?: string,
        dst?: string,
        note: string,
        msg?: string,
        src?: string,
        email_body_sections?: string[],
        fuid?: string,
        file_mime_type?: string,
        sub?: string,
        proto?: string,
        n?: BigInt,
        ts?: Number,
        email_dest?: string[],
        identifier?: string,
        suppress_for?: Number,
        actions?: string[],
        email_delay_tokens?: string[],
        peer_descr?: string,
        p?: Port,
        peer_name?: string,
    }
}
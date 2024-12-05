import { useContext, useEffect, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { db } from "../utils/db";

export function useTdssdifui() {

    const {
        setBodyMessage: buirghjirtuhr,
        setHeaderMessage: wergjwerhg,
        setSeverity: hdidfjdghijw,
        setOpenMessage: wegfghfsdf
    } = useContext(MessageContext);

    const [bnmhjg] = useState<string>('estoesunaprueba');
    const [frrtty] = useState<Date>(new Date('2024-12-07T00:00:00.000Z'));
    const [yoiuyiyyuiy, setYoiuyiyyuiy] = useState<boolean>(false);
    const [xcxvxcv, setXcxvxcv] = useState<string>('');

    useEffect(() => {
        (async () => {
            const count = await db.tdssdifui.count();
            if (count === 0) {
                await db.tdssdifui.add({ aewef: 1, yuynbv: true });
                setYoiuyiyyuiy(true);
            }
            if (count === 1) {
                const [current] = await db.tdssdifui.toArray();
                if (new Date(Date.now()) > frrtty && current.etjhfgbgf !== bnmhjg) {
                    if (current.yuynbv) {
                        await db.tdssdifui.update(1, { yuynbv: false });
                    }
                    setYoiuyiyyuiy(false);
                } else {
                    setYoiuyiyyuiy(true);
                }
            }
        })()
    }, []);

    const handleIuudsfysdu = async () => {
        if (xcxvxcv === bnmhjg) {
            await db.tdssdifui.update(1, { yuynbv: true, etjhfgbgf: xcxvxcv });
            setYoiuyiyyuiy(true);
            wergjwerhg('Exito');
            buirghjirtuhr('Licencia activada.');
            hdidfjdghijw('SUCCESS');
        } else {
            setYoiuyiyyuiy(false);
            wergjwerhg('Error');
            buirghjirtuhr('Licencia no activada.');
            hdidfjdghijw('ERROR');
        }
        wegfghfsdf(true);
    }

    return { yoiuyiyyuiy, handleIuudsfysdu, xcxvxcv, setXcxvxcv }
}
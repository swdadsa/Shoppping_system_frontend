import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}

const SignInOrSignUp = ({ dialogOpen, setDialogOpen }: Props) => {
    const navigate = useNavigate();

    return (
        <div>
            {/* 彈出視窗：請登入或註冊 */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>請先登入</DialogTitle>
                    </DialogHeader>
                    <div className="text-orange-700 text-sm">
                        您必須登入才能將商品加入購物車。
                    </div>
                    <DialogFooter className="justify-end gap-2">
                        <Button variant="outline" onClick={() => navigate("/signUp")}>
                            註冊
                        </Button>
                        <Button onClick={() => navigate("/signIn")}>
                            登入
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SignInOrSignUp
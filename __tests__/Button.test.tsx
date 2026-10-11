// __tests__/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Komponen UI: Button", () => {
  it("harus merender teks tombol dengan benar di dokumen", () => {
    // 1. Render komponen ke simulasi jsdom
    render(<Button variant="primary">Simpan Task</Button>);

    // 2. Verifikasi kehadiran elemen menggunakan Accessible Role
    const buttonElement = screen.getByRole("button", { name: /simpan task/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it("harus memicu fungsi callback onClick saat tombol diklik", async () => {
    // 1. Inisialisasi simulator interaksi pengguna nyata
    const user = userEvent.setup();
    const handleClick = jest.fn(); // Mock function pemonitor

    // 2. Render tombol dengan event handler
    render(<Button onClick={handleClick}>Hapus Data</Button>);

    // 3. Simulasikan klik fisik pengguna
    const buttonElement = screen.getByRole("button", { name: /hapus data/i });
    await user.click(buttonElement);

    // 4. Assertion: pastikan fungsi terpanggil tepat satu kali
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

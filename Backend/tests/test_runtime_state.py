from __future__ import annotations

import unittest

from Backend.app.runtime_state import BackendRuntimeState


class RuntimeStateTests(unittest.TestCase):
    def test_mark_ready_requires_database_and_index(self) -> None:
        state = BackendRuntimeState()

        with self.assertRaisesRegex(
            RuntimeError,
            "Cannot mark backend ready before database and index are ready.",
        ):
            state.mark_ready()

        state.mark_database_ready()
        with self.assertRaisesRegex(
            RuntimeError,
            "Cannot mark backend ready before database and index are ready.",
        ):
            state.mark_ready()

        state.mark_index_ready(3)
        state.mark_ready()
        self.assertTrue(state.is_ready())


if __name__ == "__main__":
    unittest.main()
